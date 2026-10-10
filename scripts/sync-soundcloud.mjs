#!/usr/bin/env node
/*
 * Pulls KAS5H's public SoundCloud uploads into src/content/soundcloud.json, so
 * the crate fills itself. No API key needed: SoundCloud publishes an RSS feed
 * for every account.
 *
 * Runs before every build (npm "prebuild", so each Vercel deploy is current)
 * and daily from .github/workflows/sync-soundcloud.yml. If SoundCloud can't be
 * reached, the committed file is left alone and the build carries on.
 *
 *   npm run sync
 */
import { readFile, writeFile } from 'node:fs/promises';

const USER_ID = '23528569'; // soundcloud.com/kas5hmusik
const FEED = `https://feeds.soundcloud.com/users/soundcloud:users:${USER_ID}/sounds.rss`;
const OUT = new URL('../src/content/soundcloud.json', import.meta.url);

const decode = (s) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&')
    .trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};
const attr = (xml, name, key) => {
  const m = xml.match(new RegExp(`<${name}\\b[^>]*\\s${key}="([^"]*)"`));
  return m ? decode(m[1]) : '';
};

async function main() {
  let xml;
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.warn(`[sync-soundcloud] skipped (${err.message}); keeping the committed list.`);
    return;
  }

  const tracks = xml
    .split('<item>')
    .slice(1)
    .map((chunk) => {
      const item = chunk.split('</item>')[0];
      const id = (tag(item, 'guid').match(/tracks\/(\d+)/) || [])[1];
      const published = new Date(tag(item, 'pubDate'));
      return {
        id,
        title: tag(item, 'title'),
        url: tag(item, 'link'),
        // The feed carries 3000px art; 500px is plenty for a disc label.
        cover: attr(item, 'itunes:image', 'href').replace(/-t\d+x\d+(\.\w+)$/, '-t500x500$1'),
        date: Number.isNaN(published.getTime()) ? '' : published.toISOString().slice(0, 10),
        duration: tag(item, 'itunes:duration'),
      };
    })
    .filter((t) => t.id && t.title);

  if (!tracks.length) {
    console.warn('[sync-soundcloud] the feed listed no tracks; keeping the committed list.');
    return;
  }

  const next = `${JSON.stringify({ source: FEED, tracks }, null, 2)}\n`;
  const prev = await readFile(OUT, 'utf8').catch(() => '');
  if (prev === next) {
    console.log(`[sync-soundcloud] up to date (${tracks.length} upload${tracks.length === 1 ? '' : 's'}).`);
    return;
  }
  await writeFile(OUT, next);
  console.log(`[sync-soundcloud] wrote ${tracks.length} upload${tracks.length === 1 ? '' : 's'}.`);
}

main();

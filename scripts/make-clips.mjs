#!/usr/bin/env node
/*
 * Makes the web versions of the press clips the site plays. Drive's player
 * can't handle the originals (the cuts are ~320 MB each), so for each clip in
 * src/content/videos.json this writes, into public/press/clips:
 *   <slug>.mp4 — 20 s, 720p, H.264 + AAC, faststart (a few MB)
 *   <slug>.jpg — a poster from the same moment
 * and records the result in src/content/clips.json, which turns the clip on.
 *
 * ffmpeg reads each original straight from Drive with range requests, so only
 * the part it needs is fetched. Starts a third of the way in, which skips the
 * black opening frames the old posters were taken from.
 *
 *   node scripts/make-clips.mjs            all clips
 *   node scripts/make-clips.mjs kas5h-cut-01
 * Needs ffmpeg and ffprobe on PATH.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const videos = JSON.parse(readFileSync(`${root}src/content/videos.json`, 'utf8'));
const manifestPath = `${root}src/content/clips.json`;
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const outDir = `${root}public/press/clips`;
mkdirSync(outDir, { recursive: true });

const LENGTH = 20;
const only = process.argv.slice(2);
const source = (id) => `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

for (const v of videos) {
  if (only.length && !only.includes(v.slug)) continue;
  const url = source(v.id);
  const duration = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', url,
  ]).toString().trim()) || 0;
  const start = duration > LENGTH ? Math.round(duration / 3) : 0;
  const length = Math.min(LENGTH, Math.max(1, Math.floor(duration - start)));
  const portrait = v.h > v.w;
  const mp4 = `${outDir}/${v.slug}.mp4`;
  const jpg = `${outDir}/${v.slug}.jpg`;

  console.log(`[clips] ${v.slug}: ${Math.round(duration)}s original, taking ${start}s–${start + length}s`);
  execFileSync('ffmpeg', [
    '-y', '-v', 'error', '-ss', String(start), '-t', String(length), '-i', url,
    '-vf', `scale=${portrait ? '720:-2' : '-2:720'},fps=30`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k', '-ac', '2',
    '-movflags', '+faststart', mp4,
  ], { stdio: 'inherit' });
  execFileSync('ffmpeg', [
    '-y', '-v', 'error', '-ss', '1', '-i', mp4, '-frames:v', '1', '-q:v', '4', jpg,
  ], { stdio: 'inherit' });

  manifest[v.slug] = { poster: true, start, length, bytes: statSync(mp4).size };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[clips] ${v.slug}: ${(statSync(mp4).size / 1e6).toFixed(1)} MB`);
}

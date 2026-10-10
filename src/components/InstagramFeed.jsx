import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

/*
 * His latest Instagram posts, drawn in the site's own type and frames rather
 * than Instagram's white embed. Reads a JSON feed (Behold's format: a
 * `username` and a `posts` list with `sizes`, `permalink`, `mediaType`…).
 * No feed configured, or the feed fails: the section isn't rendered at all.
 */
export default function InstagramFeed({ feed, profileUrl, marker }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!feed) return undefined;
    let live = true;
    fetch(feed)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d?.posts?.length) setData(d); })
      .catch(() => {});
    return () => { live = false; };
  }, [feed]);

  if (!data) return null;
  const posts = data.posts.slice(0, 6);
  const handle = data.username ? `@${data.username}` : 'INSTAGRAM';

  return (
    <section className="ig chapter" id="instagram" aria-labelledby="ig-title">
      <div className="container ig-head">
        <h2 className="section-title font-heading" id="ig-title">{marker} ON INSTAGRAM</h2>
        <a className="ig-handle font-mono" href={profileUrl} target="_blank" rel="noreferrer">
          {handle} <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
        </a>
      </div>
      <ul className="container ig-grid">
        {posts.map((p) => {
          const src = p.sizes?.medium?.mediaUrl || p.thumbnailUrl || p.mediaUrl;
          const isVideo = p.mediaType === 'VIDEO';
          return (
            <li key={p.id}>
              <a className="ig-post" href={p.permalink} target="_blank" rel="noreferrer">
                <img src={src} alt={p.altText || p.prunedCaption?.slice(0, 140) || 'Instagram post'} loading="lazy" decoding="async" />
                {isVideo && <span className="ig-badge font-mono">{p.isReel ? 'REEL' : 'VIDEO'}</span>}
                {p.mediaType === 'CAROUSEL_ALBUM' && <span className="ig-badge font-mono">{p.children?.length || ''} ▤</span>}
                {p.prunedCaption && <span className="ig-cap">{p.prunedCaption}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

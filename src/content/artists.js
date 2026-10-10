/*
 * All copy and imagery for the two aliases lives here. The theme key is what
 * App/ThemeHud switch on; everything else is looked up from it.
 *   'garagesale' = KAS5H — groovy, accessible. Night: near-black + rave orange,
 *                  shot in clubs and on rooftops.
 *   'm0rf'       = M0rf  — experimental, unpredictable. Day-lab: ice white +
 *                  ultraviolet, lifted from his blue-white studio shoot.
 */
import portraitHero from '../assets/portrait-hero.jpg';
import portraitMesh from '../assets/portrait-mesh.jpg';
import djBooth from '../assets/dj-booth.png';
import synced from './soundcloud.json';

export const SOUNDCLOUD = 'https://soundcloud.com/kas5hmusik';
export const INSTAGRAM = 'https://instagram.com'; // TODO: real handle
export const BOOKING_EMAIL = 'bookings@kas5hmusik.com'; // TODO: confirm

/*
 * Instagram. Empty = the section stays hidden. Set it to a JSON feed URL:
 * a Behold feed (https://feeds.behold.so/<id>, free, his latest 6 posts) or
 * any file with the same shape, e.g. /instagram.json written by a job that
 * reads the Instagram API with his token.
 */
export const INSTAGRAM_FEED = '';

const scEmbed = (trackId, hex, visual = true) =>
  `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A${trackId}` +
  `&color=%23${hex}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=${visual}`;

export const ARTISTS = {
  garagesale: {
    key: 'garagesale',
    name: 'KAS5H',
    marker: '▲',
    accentHex: 'ff3300',
    themeColor: '#0a0a0a',
    frame: 'frame-garage',
    images: {
      hero: { src: portraitHero, alt: 'KAS5H in a black suit, hair blurred into an orange streak against blue smoke' },
      bio: { src: djBooth, alt: 'KAS5H laughing over the decks, hands up in the crowd behind' },
      contact: { src: '/promo/p13.jpg', alt: 'KAS5H playing under blue club light' },
    },
    ticker: ['ROMANIAN MINIMAL', 'DEEPTECH', 'DEEP HYPNOTIC', 'TECH HOUSE', 'UKG', 'LEFT FIELD', 'TRANCE TEXTURES', 'ROLLING BASSLINES'],
    hero: {
      kicker: 'DELHI NCR // DJ · SELECTOR · FOUNDER',
      title: 'KAS5H',
      stroke: 'SOUND',
      lead: 'Romanian minimal, deeptech, deep hypnotic with trance textures, tech house, UKG and left-field sounds. Tight grooves, rolling basslines, melancholic vocals.',
      tag: 'SUBJECT_LOCKED // KAS5H',
      cta: { label: 'PLAY THE LATEST', action: 'play', icon: 'solar:play-bold' },
    },
    bio: {
      tag: 'LIVE // IN THE BOOTH',
      credits: ['FOUNDER — MISFIT LABS', 'FOUNDER — CELESTIAL DRIFT CIRCLE'],
      // [text, distort?] pairs — distorted words get the hover glitch
      parts: [
        ['KAS5H is a Delhi NCR-based DJ, selector and founder of Misfit Labs and Celestial Drift Circle. His sets flow through '],
        ['Romanian Minimal', true], [', '], ['Deeptech', true], [', '], ['Deep Hypnotic', true],
        [' with trance textures, '], ['tech house', true], [', '], ['UKG', true],
        [' and left-field sounds, driven by tight grooves, rolling basslines and melancholic vocal textures. An avid digger, always after forward-thinking sounds, he curates intimate underground experiences that champion groove, community and progressive club culture.'],
      ],
    },
    tracks: {
      title: '▲ THE RECORD CRATE',
      subtitle: 'LIVE FROM SOUNDCLOUD // MIXES, EDITS & SELECTIONS',
    },
    press: { title: '▲ PRESS & PROMO KIT' },
    roster: { title: '▲ ONE SELECTOR // TWO SIGNALS' },
    card: {
      kicker: 'THE GROOVE SIDE',
      blurb: 'The groove side. Romanian minimal, deeptech and UKG built on rolling basslines — accessible, hypnotic, made for long nights.',
      status: 'SYSTEM STATUS: SELECTED',
    },
    offers: [
      { by: 'KAS5H', title: 'DJ sets', meta: 'Clubs, warehouses, intimate rooms — Delhi NCR and beyond' },
      { by: 'KAS5H', title: 'Mixes', meta: 'Commissioned mixes, edits and selections' },
      { by: 'KAS5H', title: 'Curation', meta: 'Misfit Labs · Celestial Drift Circle — nights, line-ups, concepts' },
      { by: 'M0rf', title: 'Sets', meta: 'The experimental set — IDM, footwork, fractured techno' },
    ],
    footer: {
      title: 'BOOKINGS',
      copy: 'Dates, mixes, curation invites and Delhi underground event info. One inbox for both aliases.',
      credit: '© 2026 KAS5H // MISFIT LABS · CELESTIAL DRIFT CIRCLE',
    },
  },

  m0rf: {
    key: 'm0rf',
    name: 'M0RF',
    marker: '●',
    accentHex: '4422ff',
    themeColor: '#eceff4',
    frame: 'frame-lab',
    images: {
      hero: { src: portraitMesh, alt: 'M0rf in a mesh top, hand to chest, washed in blue-white studio light' },
      bio: { src: '/promo/p16.jpg', alt: 'M0rf at the decks under projected light' },
      contact: { src: '/promo/p18.jpg', alt: 'M0rf in sunglasses, tattooed hand raised, in lilac light' },
    },
    ticker: ['IDM', 'BASS PRESSURE', 'FOOTWORK', 'FRACTURED TECHNO', 'LEFT TURNS', 'HIGH INTENSITY', 'CURIOUS EARS'],
    hero: {
      kicker: 'ALIAS OF KAS5H // EXPERIMENTAL CLUB',
      title: 'M0RF',
      stroke: 'SIGNAL',
      lead: 'IDM textures, bass-driven pressure, footwork energy and fractured techno rhythms. Electronic music for listeners who want challenge and surprise over a comfort zone.',
      tag: 'SIGNAL_UNSTABLE // M0RF',
      cta: { label: 'BOOK M0RF', action: 'book', icon: 'solar:letter-bold' },
    },
    bio: {
      tag: 'TRANSMISSION // M0RF',
      credits: ['HIGHER ENERGY', 'LESS PREDICTABLE'],
      parts: [
        ["Kas5h's alias M0rf ventures deeper into experimental club ideas, weaving "],
        ['IDM', true], [' textures, '], ['bass-driven pressure', true], [', '], ['footwork', true],
        [' energy and '], ['fractured techno', true],
        [' rhythms. Electronic music for listeners who like challenge and surprise instead of a comfort zone. Where Kas5h leans groovy and accessible, M0rf is higher energy and more unpredictable — rhythmic left turns and global club influences meet, crafted for curious ears. Each set pulls the dance floor into a high-intensity listening journey.'],
      ],
    },
    tracks: {
      title: '● TRANSMISSIONS',
      subtitle: 'M0RF RELEASES LAND HERE AUTOMATICALLY // FIRST SIGNAL INCOMING',
      empty: 'FIRST M0RF TRANSMISSION INCOMING',
    },
    press: { title: '● PRESS & PROMO KIT' },
    roster: { title: '● ONE SELECTOR // TWO SIGNALS' },
    card: {
      kicker: 'THE PRESSURE SIDE',
      blurb: 'The pressure side. IDM, footwork and fractured techno — higher energy, rhythmic left turns, built for curious ears.',
      status: 'SIGNAL: LOCKED',
    },
    offers: [
      { by: 'M0rf', title: 'Sets', meta: 'High-intensity listening — IDM, footwork, fractured techno' },
      { by: 'M0rf', title: 'Mixes', meta: 'Commissioned mixes for curious ears' },
      { by: 'KAS5H', title: 'Curation', meta: 'Misfit Labs · Celestial Drift Circle — nights, line-ups, concepts' },
      { by: 'KAS5H', title: 'Sets', meta: 'The groove set — minimal, deeptech, UKG' },
    ],
    footer: {
      title: 'BOOKINGS',
      copy: 'Dates, mixes, curation invites and Delhi underground event info. One inbox for both aliases.',
      credit: '© 2026 KAS5H // M0RF // MISFIT LABS · CELESTIAL DRIFT CIRCLE',
    },
  },
};

export const embedSrc = (artist, track, visual = true) => scEmbed(track.id, artist.accentHex, visual);

/*
 * The record crate.
 * - His own uploads arrive by themselves: scripts/sync-soundcloud.mjs reads his
 *   public SoundCloud feed into ./soundcloud.json before every build and daily.
 * - PINNED holds releases that live on other accounts (label mixes, series),
 *   which his feed can't see. Covers for these go in public/covers.
 * - A title that mentions M0rf goes to M0rf's crate; everything else is KAS5H.
 * Only credits that are actually known go in.
 */
const PINNED = [
  {
    id: '2229482819',
    title: 'SPL 012 — Spellbound',
    cover: '/covers/spl-012.jpg',
    url: 'https://soundcloud.com/spellbound_minimal/spl-012-kas5h',
    alias: 'garagesale',
    credits: [
      { label: 'Artist', value: 'KAS5H' },
      { label: 'Series', value: 'Spellbound' },
      { label: 'Format', value: 'Mix' },
    ],
  },
];

const isM0rf = (title) => /\bm[0o]rf\b/i.test(title);

// "PECULIAR EP 1 - Thoughts Are Things | KAS5H" → "PECULIAR EP 1 — Thoughts Are Things"
const cleanTitle = (title) =>
  title.replace(/\s*[|–—-]\s*(kas5h|m[0o]rf)\s*$/i, '').replace(/\s+-\s+/g, ' — ').trim();

const month = (iso) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';

const fromFeed = (t) => {
  const alias = isM0rf(t.title) ? 'm0rf' : 'garagesale';
  const title = cleanTitle(t.title);
  const format = (title.match(/\b(EP|LP)\b/) || [])[1];
  return {
    id: t.id,
    title,
    cover: t.cover,
    url: t.url,
    alias,
    credits: [
      { label: 'Artist', value: alias === 'm0rf' ? 'M0rf' : 'KAS5H' },
      ...(format ? [{ label: 'Format', value: format }] : []),
      ...(t.date ? [{ label: 'Released', value: month(t.date) }] : []),
      ...(t.duration ? [{ label: 'Length', value: t.duration.replace(/^00:/, '').replace(/^0(?=\d:)/, '') }] : []),
    ],
  };
};

const ALL_RELEASES = [
  ...[...synced.tracks].sort((x, y) => (y.date || '').localeCompare(x.date || '')).map(fromFeed),
  ...PINNED,
].filter((r, i, list) => list.findIndex((o) => o.id === r.id) === i);

/* Newest first; uploads ahead of pinned label mixes. */
export const releasesFor = (alias) => ALL_RELEASES.filter((r) => r.alias === alias);

/* The first track the hidden SoundCloud player loads, whichever alias opens. */
export const FIRST_RELEASE = ALL_RELEASES[0];

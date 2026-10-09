/*
 * All copy for the two aliases lives here. The theme key is what App/ThemeHud
 * switch on; everything else is looked up from it.
 *   'garagesale' = KAS5H  — groovy, accessible. Dark + rave orange.
 *   'm0rf'       = M0rf   — higher energy, experimental. Void violet + acid green.
 */

export const SOUNDCLOUD = 'https://soundcloud.com/kas5hmusik';
export const INSTAGRAM = 'https://instagram.com'; // TODO: real handle
export const BOOKING_EMAIL = 'bookings@kas5hmusik.com'; // TODO: confirm

const scEmbed = (trackId, hex, visual = true) =>
  `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A${trackId}` +
  `&color=%23${hex}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=${visual}`;

export const ARTISTS = {
  garagesale: {
    key: 'garagesale',
    name: 'KAS5H',
    marker: '▲',
    hudLabel: '▲ KAS5H',
    accentHex: 'ff3300',
    frame: 'frame-garage',
    ticker: ['ROMANIAN MINIMAL', 'DEEPTECH', 'DEEP HYPNOTIC', 'TECH HOUSE', 'UKG', 'LEFT FIELD', 'MISFIT LABS', 'CELESTIAL DRIFT CIRCLE'],
    hero: {
      kicker: 'DELHI NCR // DJ · SELECTOR · FOUNDER',
      title: 'KAS5H',
      stroke: 'SOUND',
      lead: 'Romanian minimal, deeptech, deep hypnotic with trance textures, tech house, UKG and left-field sounds. Tight grooves, rolling basslines, melancholic vocals.',
      tag: 'SUBJECT_LOCKED // KAS5H',
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
      featuredTag: '★ NOW SPINNING // PECULIAR EP 1 — THOUGHTS ARE THINGS',
      featured: { id: '2401966335', title: 'PECULIAR EP 1 - Thoughts Are Things | KAS5H' },
      alsoTag: 'PREVIOUSLY // SPL 012 — SPELLBOUND',
      also: { id: '2229482819', title: 'SPL 012 - KAS5H (Spellbound)' },
    },
    press: { title: '▲ PRESS & PROMO KIT' },
    roster: {
      title: '▲ ONE SELECTOR // TWO SIGNALS',
      subtitle: 'TAP AN ALIAS TO SWITCH THE SYSTEM',
    },
    card: {
      blurb: 'The groove side. Romanian minimal, deeptech and UKG built on rolling basslines — accessible, hypnotic, made for long nights.',
      status: 'SYSTEM STATUS: SELECTED',
      standby: 'SYSTEM STATUS: STANDBY',
    },
    offers: [
      { title: 'DJ sets', meta: 'Clubs, warehouses, intimate rooms — Delhi NCR and beyond' },
      { title: 'Mixes', meta: 'Commissioned mixes, edits and selections' },
      { title: 'Curation', meta: 'Misfit Labs · Celestial Drift Circle — nights, line-ups, concepts' },
      { title: 'M0rf', meta: 'The experimental set — IDM, footwork, fractured techno' },
    ],
    footer: {
      title: 'BOOKINGS',
      copy: 'Dates, mixes, curation invites and Delhi underground event info. One inbox for both aliases.',
      cta: 'DISPATCH AGENT',
      credit: '© 2026 KAS5H // MISFIT LABS · CELESTIAL DRIFT CIRCLE',
    },
  },

  m0rf: {
    key: 'm0rf',
    name: 'M0RF',
    marker: '●',
    hudLabel: '● M0RF',
    accentHex: '39ff14',
    frame: 'frame-gruv',
    ticker: ['IDM', 'BASS PRESSURE', 'FOOTWORK', 'FRACTURED TECHNO', 'LEFT TURNS', 'HIGH INTENSITY', 'CURIOUS EARS'],
    hero: {
      kicker: 'ALIAS OF KAS5H // EXPERIMENTAL CLUB',
      title: 'M0RF',
      stroke: 'SIGNAL',
      lead: 'IDM textures, bass-driven pressure, footwork energy and fractured techno rhythms. Electronic music for listeners who want challenge and surprise over a comfort zone.',
      tag: 'SIGNAL_UNSTABLE // M0RF',
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
      title: '● SELECTED TRANSMISSIONS',
      subtitle: 'LIVE FROM SOUNDCLOUD // THE SAME CRATE, PLAYED HARDER',
      featuredTag: '★ FEATURED // PECULIAR EP 1 — THOUGHTS ARE THINGS',
      featured: { id: '2401966335', title: 'PECULIAR EP 1 - Thoughts Are Things | KAS5H' },
      alsoTag: 'ARCHIVE // SPL 012 — SPELLBOUND',
      also: { id: '2229482819', title: 'SPL 012 - KAS5H (Spellbound)' },
    },
    press: { title: '● PROMOTIONAL CONTENT' },
    roster: {
      title: '● ONE SELECTOR // TWO SIGNALS',
      subtitle: 'TAP AN ALIAS TO SWITCH THE SYSTEM',
    },
    card: {
      blurb: 'The pressure side. IDM, footwork and fractured techno — higher energy, rhythmic left turns, built for curious ears.',
      status: 'SIGNAL: LOCKED',
      standby: 'SIGNAL: DORMANT',
    },
    offers: [
      { title: 'M0rf sets', meta: 'High-intensity listening — IDM, footwork, fractured techno' },
      { title: 'Mixes', meta: 'Commissioned mixes for curious ears' },
      { title: 'Curation', meta: 'Misfit Labs · Celestial Drift Circle — nights, line-ups, concepts' },
      { title: 'KAS5H', meta: 'The groove set — minimal, deeptech, UKG' },
    ],
    footer: {
      title: 'BOOKINGS',
      copy: 'Dates, mixes, curation invites and Delhi underground event info. One inbox for both aliases.',
      cta: 'OPEN CHANNEL',
      credit: '© 2026 KAS5H // M0RF // MISFIT LABS · CELESTIAL DRIFT CIRCLE',
    },
  },
};

export const embedSrc = (artist, track, visual = true) => scEmbed(track.id, artist.accentHex, visual);

/*
 * The record crate. One entry per release or mix; the disc cascade shows the
 * real cover on each disc and the player under it follows the chosen one.
 * Add a release by appending: `id` is the SoundCloud track id, `cover` a
 * 500×500 jpg saved under public/covers (SoundCloud's oEmbed thumbnail_url),
 * `url` the public track page. Only credits that are actually known go in.
 */
export const RELEASES = [
  {
    id: '2401966335',
    title: 'Peculiar EP 1 — Thoughts Are Things',
    cover: '/covers/peculiar-ep-1.jpg',
    url: 'https://soundcloud.com/kas5hmusik/peculiar-ep-1-thoughts-are',
    credits: [
      { label: 'Artist', value: 'KAS5H' },
      { label: 'Format', value: 'EP' },
      { label: 'Series', value: 'Peculiar' },
    ],
  },
  {
    id: '2229482819',
    title: 'SPL 012 — Spellbound',
    cover: '/covers/spl-012.jpg',
    url: 'https://soundcloud.com/spellbound_minimal/spl-012-kas5h',
    credits: [
      { label: 'Artist', value: 'KAS5H' },
      { label: 'Series', value: 'Spellbound' },
      { label: 'Format', value: 'Mix' },
    ],
  },
];

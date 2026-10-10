/*
 * The press kit: every photo and clip from KAS5H's Drive folders.
 *   id   — Google Drive file id (downloads stream from Drive)
 *   file — local copy in public/promo (full 1000px) and public/promo/thumbs (560px)
 *   w, h — real pixel size, so the slider reserves the right space before load
 * Folders must stay shared as "Anyone with the link".
 */
import clips from './clips.json';

export const PHOTOS_FOLDER = 'https://drive.google.com/drive/folders/1yAEKO6m7KmORhViFiVblM_j_0cHQRjr5';
export const VIDEOS_FOLDER = 'https://drive.google.com/drive/folders/1-3sSyD6JXhEPba7rLHuBZTPFeZqIs_A4';

export const driveDownload = (id) => `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

export const PHOTOS = [
  { id: '1j4fYVKwFKpcWcAzSpwbt3zhJ2Aatyxo1', file: 'p01', name: '039A0003.jpg', w: 1000, h: 666 },
  { id: '1K1dmMhIzSRpF6SUPLpeAUhjJ5fjDnzhp', file: 'p02', name: '039A0008.jpg', w: 666, h: 1000 },
  { id: '1trfw6tNaMjZbQO1jn0HA4oMXVSWqQHxw', file: 'p03', name: '039A0011.jpg', w: 1000, h: 666 },
  { id: '1O741tjWN85yOG3ucoKLF1-7Ym6AvKbo0', file: 'p04', name: '039A9669.jpg', w: 719, h: 1000 },
  { id: '1IYy86tF-FYbtTrSs5khEJrH2Ke62MIWl', file: 'p05', name: '039A9996.jpg', w: 1000, h: 666 },
  { id: '1tdkaIELo1-rt-j7B84jqxZRnhFxx8wgq', file: 'p06', name: '0H6A1399.jpg', w: 666, h: 1000 },
  { id: '1mcX1R-5L-svATJVXpknKsMTcvPwrkJeo', file: 'p07', name: '2P1A6738.jpg', w: 1000, h: 666 },
  { id: '1mXIfEyvhIU_lMPUzZ6WG3z0-FyGf9dZy', file: 'p08', name: '2P1A6771.jpg', w: 1000, h: 666 },
  { id: '1m_IaEyxtdSfN4lKjLhfKtx81dE8FVx_o', file: 'p09', name: '2P1A6785.jpg', w: 1000, h: 666 },
  { id: '1m34QBB6rOgpy2xQ6oJ7ptgia78ncHits', file: 'p10', name: '2P1A6799.jpg', w: 1000, h: 666 },
  { id: '1_x0vM3qFKG-L3sFv5sTVRirnQvg0w7mq', file: 'p11', name: 'DSC06221.jpg', w: 1000, h: 666 },
  { id: '1gD53DTYc-zU7IJJNgsxwJ50f73LJRL8O', file: 'p12', name: 'DSC06302.jpg', w: 666, h: 1000 },
  { id: '1VtZRfRcSiukOGlCEXXJxJtexvdSEwO7W', file: 'p13', name: 'DSC06303.jpg', w: 666, h: 1000 },
  { id: '1M_zRQYeJ-yHAhDPW0AIAslB1doNLe4bG', file: 'p14', name: 'DSC06320.jpg', w: 666, h: 1000 },
  { id: '1dykW0LQBctOhrR7i29Dvfw73FL8FkHyY', file: 'p15', name: 'DSC06346.jpg', w: 666, h: 1000 },
  { id: '1oTrTUWDJIpcZr8ElwTeUhILQm3COvb6O', file: 'p16', name: 'DSC08331.jpg', w: 666, h: 1000 },
  { id: '1nT19pKA16lDjjpB1V3wWFp0NhnqXQM78', file: 'p17', name: 'DSC08335.jpg', w: 1000, h: 666 },
  { id: '1xZPmtG1zq-BSJE2dccb6VFWxrixSm__U', file: 'p18', name: 'IMG_1084.jpg', w: 666, h: 1000 },
  { id: '1yhcdEpsNng_AKPp13WeS3e4peORHU6Dn', file: 'p19', name: 'IMG_1088.jpg', w: 666, h: 1000 },
  { id: '1zv7ImrIxHzTNEi-hbQ6Ka3NDJgfe5CsU', file: 'p20', name: 'IMG_1089.jpg', w: 666, h: 1000 },
  { id: '1eySbagRT23bb7NTHyRmED5zUGCTc6aWe', file: 'p21', name: 'IMG_1091.jpg', w: 666, h: 1000 },
  { id: '1UlTfZuH7zbeoEkDuG4gYQLYth7EEn9Nx', file: 'p22', name: 'IMG_5862.jpg', w: 1000, h: 666 },
  { id: '1zIOlH6V0uY1K4ZWy460kj41B-mJC-G1_', file: 'p23', name: 'IMG_5905.jpg', w: 1000, h: 666 },
  { id: '1bUxOejyse_7OnB-c-EFJtilGk24V7Zxv', file: 'p24', name: 'IMG_5941.jpg', w: 1000, h: 666 },
  { id: '1PDVWkaUvbP1dWY8EUwq1fYuaBjJROnVw', file: 'p25', name: 'IMG_5977.jpg', w: 1000, h: 666 },
  { id: '1MfNgI0Tzo9sYvk-Zz38MB7yXO2td7LVw', file: 'p26', name: 'IMG_6069.jpg', w: 666, h: 1000 },
  { id: '13nEbtuLxl5F4O0GTBNV1BWlkDxwEWiUo', file: 'p27', name: 'IMG_6300.jpg', w: 1000, h: 666 },
  { id: '11ldH-OU7xFsr5OnwA3X7Av2XhDfgDxR1', file: 'p28', name: 'IMG_9253.jpg', w: 1000, h: 666 },
  { id: '1QVGMylchMA-pb1-5EQXsTjkAZPMvMsuw', file: 'p29', name: 'IMG_9405.jpg', w: 1000, h: 666 },
  { id: '1hz2MPYl6lGt3yJPumgvQoq4b17F7ltWd', file: 'p30', name: 'IMG_9473.jpg', w: 1000, h: 666 },
  { id: '1qZJ7cIhLIq_aMJVQEU8nDCEj9Cwnibro', file: 'p31', name: 'IMG_9480.jpg', w: 666, h: 1000 },
  { id: '1Y9wvB5za0aC2EALhfkNyHJPfaWeAtCr7', file: 'p32', name: 'IMG_9519.jpg', w: 1000, h: 666 },
  { id: '1crC7hhWjl6N3mcmhWy2_jw0Xx1NTPHoq', file: 'p33', name: 'IMG_9524.jpg', w: 1000, h: 666 },
  { id: '1ewW7N-csCK7HqaLdLX8SM7JdylSgAAUM', file: 'p34', name: 'IMG_9567.jpg', w: 1000, h: 666 },
];

/*
 * Clips. Drive's own player can't play these (the cuts are ~320 MB each), so
 * the site plays small web versions from public/press/clips/<slug>.mp4 instead.
 * A clip shows on the page once its file is listed in clips.json.
 */
const VIDEO_FILES = [
  { id: '1JLiwSTKXDOzaPLwUpCspLn1VlI8Pwrwu', slug: 'kas5h-promo-reel', name: 'KAS5H-promo-reel.mp4', label: 'PROMO REEL', poster: 'v01', w: 506, h: 900 },
  { id: '16Wi51PoZGqvH0GdIxTsNgkeLofndNZxD', slug: 'kas5h-cut-01', name: 'KAS5H-cut-01.mp4', label: 'PROMO CUT 01', poster: 'v02', w: 900, h: 474 },
  { id: '1uy2ZG-p6Q61LqylwBkCuOS4Z-xkIzeCp', slug: 'kas5h-cut-02', name: 'KAS5H-cut-02.mp4', label: 'PROMO CUT 02', poster: 'v03', w: 900, h: 474 },
  { id: '1gHcP9LjWtyiHWFUUTEypZfIs4ZqgOqcq', slug: 'kas5h-cut-03', name: 'KAS5H-cut-03.mp4', label: 'PROMO CUT 03', poster: 'v04', w: 900, h: 474 },
  { id: '13rhj04BB8yjqfHqOZFKa_9jER2Zkdgwg', slug: 'kas5h-cut-04', name: 'KAS5H-cut-04.mp4', label: 'PROMO CUT 04', poster: 'v05', w: 900, h: 474 },
  { id: '1GVweRj7KV-xK19fwTy3MzDJIVffI14a8', slug: 'kas5h-live-01', name: 'KAS5H-live-01.mov', label: 'LIVE SET CLIP', poster: 'v06', w: 900, h: 505 },
  { id: '1fW87oZjI4fgMLkVslKdNvCQY4JgxclV1', slug: 'kas5h-live-02', name: 'KAS5H-live-02.mov', label: 'LIVE SET CLIP', poster: 'v07', w: 506, h: 900 },
];

export const VIDEOS = VIDEO_FILES.map((v) => ({
  ...v,
  clip: clips[v.slug] ? `/press/clips/${v.slug}.mp4` : null,
  still: clips[v.slug]?.poster ? `/press/clips/${v.slug}.jpg` : `/promo/${v.poster}.jpg`,
  portrait: v.h > v.w,
}));

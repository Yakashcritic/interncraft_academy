/**
 * Remote stock photos (Unsplash) — demo visuals. Replace with your own assets in /public when ready.
 * Attribution: photos from https://unsplash.com (Unsplash License).
 */
const u = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

export const SITE_IMAGES = {
  hero: u("photo-1523240795612-9a054b0db644", 1400),
  /** Small circles under “Trusted by learners” */
  heroAvatars: [
    u("photo-1494790108377-be9c29b29330", 128),
    u("photo-1507003211169-0a1dd7228f2d", 128),
    u("photo-1438761681033-6461ffad8d80", 128),
    u("photo-1472099645785-5658abf4ff4e", 128),
  ],
  categories: {
    ai: u("photo-1677442136019-21780ecad995", 800),
    marketing: u("photo-1460925895917-422fd7c7c49d", 800),
    video: u("photo-1574717024653-866276125805", 800),
    business: u("photo-1552664730-d307ca884978", 800),
  },
  features: {
    /** Local asset — large “Live masterclasses” tile (always loads, matches theme) */
    liveMasterclass: "/images/feature-live-masterclass.svg",
  },
  bento: {
    live: u("photo-1517245386807-bb43f82c33c4", 700),
    async: u("photo-1434030216411-0b793f4b4173", 700),
    ship: u("photo-1498050108023-c5249f4df085", 700),
    /** Unsplash IDs below 404’d — replaced with on-brand local SVGs */
    proof: "/images/bento-proof.svg",
    people: "/images/bento-people.svg",
    career: u("photo-1507679799987-c73779587ccf", 700),
  },
};

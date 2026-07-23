/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  الرابط الوحيد الذي يحتاج تعديلًا قبل الإرسال — ضعي رابط الموقع من Google Maps
 *  THE ONE VALUE TO EDIT BEFORE SENDING — paste the final Google Maps link here.
 *
 *  اتركيه كما هو وستبقى بطاقة "المكان" ظاهرة بالنص فقط بدون زر.
 *  Left as-is, the location medallion simply stays non-clickable (no broken link).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const MAP_URL = 'REPLACE_WITH_FINAL_GOOGLE_MAPS_LINK';

/** True once a real link has been pasted above. */
export const hasMapUrl = /^https?:\/\//i.test(MAP_URL);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  الموسيقى — لا يوجد ملف صوتي حاليًا / NO AUDIO FILE IS SHIPPED WITH THIS BUILD.
 *
 *  بعد وضع ملف mp3 مرخّص في:  public/audio/kayla-invitation.mp3
 *  غيّري السطر التالي إلى:     export const AUDIO_SRC = '/audio/kayla-invitation.mp3';
 *
 *  While this is null the sound button is not rendered at all — no broken player,
 *  no failed request in the console.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const AUDIO_SRC: string | null = null;

/** Prefix for static assets (set to `/kayla-graduation` in the production build). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${BASE_PATH}${path}`;

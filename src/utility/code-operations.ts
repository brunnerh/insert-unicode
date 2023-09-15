import { emojiCodes } from '../data';

/** Indicates whether a code point is a skin tone modifier. */
export const isSkinToneModifier = (code: number) =>
	code >= 0x1f3fb && code <= 0x1f3ff;

const codesSet = new Set(emojiCodes.map(codes => codes.join(',')));

/** Indicates whether code points refer to an emoji. */
export const isEmoji = (codes: number[]) =>
	codesSet.has(codes.join(','));

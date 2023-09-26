import { emoji } from '../data';

/** Indicates whether a code point is a skin tone modifier. */
export const isSkinToneModifier = (code: number) =>
	code >= 0x1f3fb && code <= 0x1f3ff;

const codesSet = new Set(
	emoji
		.filter(e => e.type == 'fully-qualified')
		.map(e => e.codes.join(','))
);

/** Indicates whether code points refer to an emoji. */
export const isEmoji = (codes: number[]) =>
	codesSet.has(codes.join(','));

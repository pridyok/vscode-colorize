import Color from './../color';
import ColorExtractor from '../color-extractor';
import { convertHslaToRgba, parseAlpha } from '../../util/color-util';
import { DOT_VALUE, DEG_VALUE, ALPHA, EOL, BOUNDARY_FRONT } from '../../util/regexp';
import ColorStrategy from './__strategy-base';

// TODO: Add support for / opacity
const R_HUE = `\\d*${DOT_VALUE}?${DEG_VALUE}?`;
const R_SATURATION = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})%`;
const R_LUMINANCE = R_SATURATION;

export const REGEXP = new RegExp(`${BOUNDARY_FRONT}((?:hsla?\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}\\s*,\\s*${R_LUMINANCE}\\s*(?:,\\s*${ALPHA}\\s*)?\\))|(?:hsla?\\(\\s*${R_HUE}\\s*${R_SATURATION}\\s*${R_LUMINANCE}\\s*(?:\\/\\s*${ALPHA}\\s*)?\\)))${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(`^${BOUNDARY_FRONT}((?:hsla?\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}\\s*,\\s*${R_LUMINANCE}\\s*(?:,\\s*${ALPHA}\\s*)?\\))|(?:hsla?\\(\\s*${R_HUE}\\s*${R_SATURATION}\\s*${R_LUMINANCE}\\s*(?:\\/\\s*${ALPHA}\\s*)?\\)))${EOL}`, 'i');
// export const REGEXP_ONE = /^((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/i;

/**
 * @private
 * @param {any} value An hsl(a) color string (`hsl(10, 1%, 1%)`)
 * @returns {number[]} The colors h,s,l,a values
 *
 * @memberof HSLColorExtractor
 */
function extractHSLValue(value) {
  const [h, s, l, a]: number[] = value.replace(/hsla?\(/, '').replace(/\)/, '').replace(/%/g, '').replace(/${DEG_VALUE}/, '').split(/[\s,/]+/gi).map(c => parseFloat(c));
  return [h, s, l, parseAlpha(a)];
}

function getColor(match: RegExpExecArray): Color {
  const value = match[0];
  const [h, s, l, a] = extractHSLValue(value);
  if (s <= 100 && l <= 100) {
    const [r, g, b] = convertHslaToRgba(h, s, l, a);
    return new Color(match[1], match.index, [r, g, b], a);
  }
  return null;
}
const strategy = new ColorStrategy('HSL', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;

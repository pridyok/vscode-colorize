import ColorExtractor from '../color-extractor';
import Color from '../color';
import { parseAlpha } from '../../util/color-util';
import { DOT_VALUE, ALPHA, EOL, BOUNDARY_FRONT } from '../../util/regexp';
import ColorStrategy from './__strategy-base';

const R_RED = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})%?`;
const R_GREEN = R_RED;
const R_BLUE = R_RED;

export const REGEXP = new RegExp(
  `${BOUNDARY_FRONT}((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgb\\(\\s*${R_RED}\\s*${R_GREEN}\\s*${R_BLUE}\\s*(?:\\/\\s*${ALPHA}\\s*)?\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${ALPHA}\\s*\\)))${EOL}`,
  'gi',
);
export const REGEXP_ONE = new RegExp(
  `^${BOUNDARY_FRONT}((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgb\\(\\s*${R_RED}\\s*${R_GREEN}\\s*${R_BLUE}\\s*(?:\\/\\s*${ALPHA}\\s*)?\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${ALPHA}\\s*\\)))${EOL}`,
  'i',
);

function extractRGBA(value: string): number[] {
  const rgba_string = value.replace(/rgba?\(/, '').replace(/\)/, '').replace(/%/g, '');
  return rgba_string.split(/[\s,/]+/gi).map((c) => parseFloat(c));
}

function getColor(match: RegExpExecArray): Color {
  const value = match[1];
  const rgba = extractRGBA(value);
  const alpha = parseAlpha(rgba[3] || 1);
  const rgb = rgba.slice(0, 3) as [number, number, number];
  // Check if it's a valid rgb(a) color
  if (rgb.every((c) => c <= 255)) {
    return new Color(match[1], match.index, rgb, alpha);
  }
  return null;
}
const strategy = new ColorStrategy('RGB', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);

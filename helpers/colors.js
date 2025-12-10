/**
 * Object that contains auto generated colors.
 * @typedef {Object} AutoColors
 * @property {string} main        Main color hex in format "#rrggbb".
 * @property {string} background  Background color hex in format "#rrggbb".
 */

/**
 * Object that contains hsl color components.
 * @typedef {Object} Hsl
 * @property {number} h  Hue [0..360].
 * @property {number} s  Saturation [0..100]%.
 * @property {number} l  Lightness [0..100]%.
 */


/**
 * Gets colors - main and background - based on params.
 * 
 * @param {number} day    Day of month [1..31].
 * @param {number} month  Month of year [1..12].
 * @param {number} year   Year (any).
 * @param {string} name   Full name (optional).
 * 
 * @returns {AutoColors}
 */
const getAutoColors = ({day, month, year}, name = null) => {
    return name !== null
        ? getDateNameColors({day, month, year}, name)
        : getSeasonalColors(day, month, year);
}

/**
 * Generates colors - main and background - based on date and name.
 * 
 * @param {number} day    Day of month [1..31].
 * @param {number} month  Month of year [1..12].
 * @param {number} year   Year (any).
 * @param {string} name   Full name.
 * 
 * @returns {AutoColors}
 */
const getDateNameColors = ({day, month, year}, name) => {
    const alphabet = new Set([
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]);

    const replaceable_letters = new Map([
        ['ā', 'a'],
        ['č', 'c'],
        ['ē', 'e'],
        ['ģ', 'g'],
        ['ī', 'i'],
        ['ķ', 'k'],
        ['ļ', 'l'],
        ['ņ', 'n'],
        ['š', 's'],
        ['ū', 'u'],
        ['ž', 'z']
    ]);

    const colors = new Map([
        [1, '#D32F2F'],
        [2, '#F57C00'],
        [3, '#FFE04A'],
        [4, '#388E3C'],
        [5, '#0288D1'],
        [6, '#3949AB'],
        [7, '#A23BBC'],
        [8, '#E8508F'],
        [9, '#D8B848']
    ]);

    const name_number = [...name.toLowerCase()]
        .map(char => replaceable_letters.get(char) || char)
        .filter(char => alphabet.has(char))
        .reduce((acc, curr) => {
            const index = [...alphabet].indexOf(curr);
            const value = index % 9 + 1;

            return acc + value;
        }, 0);

    const name_number_cumulative = getSumOfDigits(name_number);

    const date_number = [...`${day}${month}${year}`]
        .reduce((acc, curr) => acc + Number(curr), 0);

    const date_number_cumulative = getSumOfDigits(date_number);

    return {
        main: colors.get(date_number_cumulative),
        background: colors.get(name_number_cumulative)
    };
}

/**
 * Generates seasonal colors - main and background - based on date.
 * 
 * @param {number} day    Day of month [1..31].
 * @param {number} month  Month of year [1..12].
 * @param {number} year   Year (any).
 * 
 * @returns {AutoColors}
 */
const getSeasonalColors = (day, month, year) => {
    const main_hsl = getMainHslSeasonal(day, month, year);
    const background_hsl = getBackgroundHslSeasonal(main_hsl.h, main_hsl.s, main_hsl.l, month);

    return {
        main: hslToHex(main_hsl.h, main_hsl.s, main_hsl.l),
        background: hslToHex(background_hsl.h, background_hsl.s, background_hsl.l)
    };
}

/**
 * Accumulates sum of all digits in number until one digit is left.
 * 
 * @param {number} number  Any number.
 * 
 * @returns {number}
 */
const getSumOfDigits = number => {
    const sum = [...`${number}`]
        .reduce((acc, curr) => acc + Number(curr), 0);

    return sum < 10 ? sum : getSumOfDigits(sum);
}

/**
 * Limits the number so it stays within given range.
 * If the number is below minimum, the minimum is returned;
 * if the number is above maximum, the maximum is returned;
 * otherwise the number itself is returned.
 * 
 * @param {number} num  The number to constrain.
 * @param {number} min  Lower bound.
 * @param {number} max  Upper bound.
 * 
 * @returns {number}
 */
const clamp = (num, min, max) => {
    return Math.max(min, Math.min(max, num));
}

/**
 * Generates hex part from given rgb component.
 * 
 * @param {number} comp  Component from rgb.
 * 
 * @returns {string}  Hex part.
 */
const componentToHex = comp => {
    const num = clamp(Math.round(comp), 0, 255);

    return `${num < 16 ? '0' : ''}${num.toString(16)}`;
}

/**
 * Generates hex from given rgb.
 * 
 * @param {number} r  Red [0..255].
 * @param {number} g  Green [0..255].
 * @param {number} b  Blue [0..255].
 * 
 * @returns {string}  Hex in format "#rrggbb".
 */
const rgbToHex = (r, g, b) => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

/**
 * Generates hex from given hsl.
 * 
 * @param {number} h  Hue [0..360].
 * @param {number} s  Saturation [0..100]%.
 * @param {number} l  Lightness [0..100]%.
 * 
 * @returns {string}  Hex in format "#rrggbb".
 */
const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const hp = h / 60;
    const c = (1 - Math.abs(2 * l - 1 )) * s;
    const x = c * (1 - Math.abs((hp % 2) - 1));

    let [r, g, b] = [0, 0, 0];

    if (0 <= hp && hp < 1) {
        [r, g, b] = [c, x, 0];
    }
    else if (1 <= hp && hp < 2) {
        [r, g, b] = [x, c, 0];
    }
    else if (2 <= hp && hp < 3) {
        [r, g, b] = [0, c, x];
    }
    else if (3 <= hp && hp < 4) {
        [r, g, b] = [0, x, c];
    }
    else if (4 <= hp && hp < 5) {
        [r, g, b] = [x, 0, c];
    }
    else {
        [r, g, b] = [c, 0, x];
    }

    const m = l - c / 2;

    return rgbToHex(
        (r + m) * 255,
        (g + m) * 255,
        (b + m) * 255
    );
}

/**
 * Generates seasonal main color hsl from given date.
 * 
 * @param {number} day    Day of month [1..31].
 * @param {number} month  Month of year [1..12].
 * @param {number} year   Year (any).
 * 
 * @returns {Hsl}
 */
const getMainHslSeasonal = (day, month, year) => {
    const base_hues = [210, 190, 160, 130, 100, 75, 55, 40, 25, 15, 330, 260];
    const month_index = clamp(month - 1, 0, 11);
    const next_index = (month_index + 1) % 12;
    const month_frac = (day - 1) / 31;
    const hue1 = base_hues[month_index];
    const hue2 = base_hues[next_index];

    let diff = hue2 - hue1;

    if (diff > 180) {
        diff -= 360;
    }
    else if (diff < -180) {
        diff += 360;
    }

    const hue = (hue1 + diff * month_frac + 360) % 360;

    let saturation = 80 + (day / 31) * 15;
    let lightness = 60 + ((year % 100) / 99) * 7;

    // Saturation higher in summer.
    if (month >= MONTHS.JUNE && month <= MONTHS.AUGUST) {
        saturation += 5;
    }

    return {
        h: hue,
        s: saturation,
        l: lightness
    };
}

/**
 * Generates seasonal background color hsl from given hsl.
 * 
 * @param {number} h      Hue [0..360].
 * @param {number} s      Saturation [0..100]%.
 * @param {number} l      Lightness [0..100]%.
 * @param {number} month  Month of year [1..12].
 * 
 * @returns {Hsl}
 */
const getBackgroundHslSeasonal = (h, s, l, month) => {
    // Saturation slightly higher than main, but capped.
    const saturation = clamp(s * 0.7 + 10, 40, 90);

    // Adaptive lightness boost.
    const boost = l < 60 ? 35 : 25;

    let lightness = clamp(l + boost, 70, 95);

    // Lightness higher in some months.
    if (month === MONTHS.FEBRUARY || month >= MONTHS.MAY && month <= MONTHS.AUGUST) {
        lightness += 4;
    }

    return {
        h,
        s: saturation,
        l: lightness
    };
}

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
 * Object that contains rgb color components.
 * @typedef {Object} Rgb
 * @property {number} r  Red [0..255].
 * @property {number} g  Green [0..255].
 * @property {number} b  Blue [0..255].
 */

/**
 * Object that contains day, month and year.
 * @typedef {Object} DayMonthYear
 * @property {number} day    Day of month [1..31].
 * @property {number} month  Month of year [1..12].
 * @property {number} year   Year (any).
 */


/**
 * Gets colors - main and background - based on params.
 * 
 * @param {DayMonthYear}
 * @param {string}       name  Full name (optional).
 * 
 * @returns {AutoColors}
 */
function getAutoColors({day, month, year}, name = null) {
    return name !== null
        ? getDateNameColors({day, month, year}, name)
        : getSeasonalColors({day, month, year});
}

/**
 * Generates colors - main and background - based on date and name.
 * 
 * @param {DayMonthYear}
 * @param {string[]}     name_letters  All valid letters of name.
 * 
 * @returns {AutoColors}
 */
function getDateNameColors({day, month, year}, name_letters) {
    const name_number = name_letters
        .reduce((acc, curr) => {
            const index = [...ALPHABET].indexOf(curr);
            const value = index % 9 + 1;

            return acc + value;
        }, 0);

    const name_number_cumulative = getSumOfDigits(name_number);
    let name_number_hex = COLORS_OF_NUMBERS.get(name_number_cumulative);

    const date_number = [...`${day}${month}${year}`]
        .reduce((acc, curr) => acc + Number(curr), 0);

    const date_number_cumulative = getSumOfDigits(date_number);
    let date_number_hex = COLORS_OF_NUMBERS.get(date_number_cumulative);

    // If numbers are same - colors are same, so:
    // increase name color lightness and
    // decrease date color lightness.
    if (name_number_cumulative === date_number_cumulative) {
        const name_number_hsl = hexToHsl(name_number_hex);
        name_number_hsl.l = clamp(name_number_hsl.l + 10, 0, 100);
        name_number_hex = hslToHex(name_number_hsl);

        const date_number_hsl = hexToHsl(date_number_hex);
        date_number_hsl.l = clamp(date_number_hsl.l - 10, 0, 100);
        date_number_hex = hslToHex(date_number_hsl);
    }

    return {
        main: date_number_hex,
        background: name_number_hex
    };
}

/**
 * Generates seasonal colors - main and background - based on date.
 * 
 * @param {DayMonthYear}
 * 
 * @returns {AutoColors}
 */
function getSeasonalColors({day, month, year}) {
    const main_hsl = getMainHslSeasonal({day, month, year});
    const background_hsl = getBackgroundHslSeasonal(main_hsl, month);

    return {
        main: hslToHex(main_hsl),
        background: hslToHex(background_hsl)
    };
}

/**
 * Generates seasonal main color hsl from given date.
 * 
 * @param {DayMonthYear}
 * 
 * @returns {Hsl}
 */
function getMainHslSeasonal({day, month, year}) {
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
 * @param {Hsl}
 * @param {number} month  Month of year [1..12].
 * 
 * @returns {Hsl}
 */
function getBackgroundHslSeasonal({h, s, l}, month) {
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

/**
 * Accumulates sum of all digits in number until one digit is left.
 * 
 * @param {number} number  Any number.
 * 
 * @returns {number}
 */
function getSumOfDigits(number) {
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
function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
}

/**
 * Generates hex part from given rgb component.
 * 
 * @param {number} comp  Component from rgb.
 * 
 * @returns {string}  Hex part.
 */
function componentToHex(comp) {
    const num = clamp(Math.round(comp), 0, 255);

    return `${num < 16 ? '0' : ''}${num.toString(16)}`;
}

/**
 * Generates hex from given rgb.
 * 
 * @param {Rgb}
 * 
 * @returns {string}  Hex in format "#rrggbb".
 */
function rgbToHex({r, g, b}) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

/**
 * Generates rgb from given hex.
 * 
 * @param {string} hex  Hex in format "#rrggbb".
 * 
 * @returns {Rgb}
 */
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255
    };
}

/**
 * Generates hex from given hsl.
 * 
 * @param {Hsl}
 * 
 * @returns {string}  Hex in format "#rrggbb".
 */
function hslToHex({h, s, l}) {
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

    return rgbToHex({
        r: (r + m) * 255,
        g: (g + m) * 255,
        b: (b + m) * 255
    });
}

/**
 * Generates hsl from given hex.
 * 
 * @param {string} hex  Hex in format "#rrggbb".
 * 
 * @returns {Hsl}
 */
function hexToHsl(hex) {
    hex = hex.replace(/^#/, '');

    const {r, g, b} = hexToRgb(hex);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;

    // Lightness.
    l = (max + min) / 2;

    if (max === min) {
        // Achromatic.
        h = s = 0;
    }
    else {
        const d = max - min;

        // Saturation.
        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        // Hue.
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0));
                break;
            case g:
                h = ((b - r) / d + 2);
                break;
            case b:
                h = ((r - g) / d + 4);
                break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

const getAutoColors = (day, month, year) => {
    const main_hsl = getMainHsl(day, month, year);
    const background_hsl = getBackgroundHsl(main_hsl.h, main_hsl.s, main_hsl.l, month);

    return {
        main: hslToHex(main_hsl.h, main_hsl.s, main_hsl.l),
        background: hslToHex(background_hsl.h, background_hsl.s, background_hsl.l)
    };
}

const clamp = (n, a, b) => {
    return Math.max(a, Math.min(b, n));
}

const componentToHex = c => {
    const v = clamp(Math.round(c), 0, 255);

    return `${v < 16 ? '0' : ''}${v.toString(16)}`;
}

const rgbToHex = (r, g, b) => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

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

const getMainHsl = (day, month, year) => {
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

    let saturation = 80 + (day / 31) * 20;
    let lightness = 60 + ((year % 100) / 99) * 15;

    // Saturation and lightness higher in summer.
    if (month >= MONTHS.JUNE && month <= MONTHS.AUGUST) {
        saturation += 10;
        lightness += 5;
    }

    return {
        h: hue,
        s: saturation,
        l: lightness
    };
}

const getBackgroundHsl = (h, s, l, month) => {
    let hue = h;

    // Seasonal hue shift: winter - warmer, summer - cooler.
    if (month <= MONTHS.FEBRUARY || month === MONTHS.DECEMBER) {
        hue = (h + 10) % 360;
    }
    else if (month >= MONTHS.JUNE && month <= MONTHS.AUGUST) {
        hue = (h - 10 + 360) % 360;
    }

    // Saturation slightly higher than main, but capped.
    const saturation = clamp(s * 0.7 + 10, 40, 90);

    // Adaptive lightness boost.
    const boost = l < 60 ? 35 : 25;
    const lightness = clamp(l + boost, 70, 95);

    return {
        h: hue,
        s: saturation,
        l: lightness
    };
}

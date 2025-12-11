/**
 * Generates two-dimensional array, mirrored if necessary.
 * 
 * @param {number} min       Number from which to start generating.
 * @param {number} max       Number to which generate.
 * @param {number} mirror_x  How many times to mirror horizontally.
 * @param {number} mirror_y  How many times to mirror vertically.
 * 
 * @returns {Array}  Two-dimensional array.
 */
function generateMirroredArray(min, max, mirror_x, mirror_y) {
    const base = [];

    for (let i = min; i <= max; i++) {
        const row = [];

        for (let j = min; j <= max; j++) {
            row.push((i * j) % 10);
        }

        base.push(row);
    }

    let mirrored = mirrorHorizontally(base, mirror_x);
    mirrored = mirrorVertically(mirrored, mirror_y);

    return mirrored;
}

/**
 * Mirror array horizontally given times.
 * 
 * @param {Array}  array  Array to mirror.
 * @param {number} times  How many times to mirror.
 * 
 * @returns {Array}
 */
function mirrorHorizontally(array, times) {
    let result = array.map(row => [...row]);

    for (let i = 0; i < times; i++) {
        result = result.map(row => row.concat([...row].reverse()));
    }

    return result;
}

/**
 * Mirror array vertically given times.
 * 
 * @param {Array}  array  Array to mirror.
 * @param {number} times  How many times to mirror.
 * 
 * @returns {Array}
 */
function mirrorVertically(array, times) {
    let result = [...array];

    for (let i = 0; i < times; i++) {
        result = result.concat([...result].reverse());
    }

    return result;
}

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
const generateMirroredArray = (min, max, mirror_x, mirror_y) => {
    // Step 1: Generate base array.
    const base = [];

    for (let i = min; i <= max; i++) {
        const row = [];

        for (let j = min; j <= max; j++) {
            row.push((i * j) % 10);
        }

        base.push(row);
    }

    /**
     * Mirror array horizontally 'mirror_x' times.
     * 
     * @param {Array} arr  Array to mirror.
     * 
     * @returns {Array}
     */
    const mirrorHorizontal = arr => {
        let result = arr.map(row => [...row]);

        for (let i = 0; i < mirror_x; i++) {
            result = result.map(row => row.concat([...row].reverse()));
        }

        return result;
    }

    /**
     * Mirror array vertically 'mirror_y' times.
     * 
     * @param {Array} arr  Array to mirror.
     * 
     * @returns {Array}
     */
    const mirrorVertical = arr => {
        let result = [...arr];

        for (let i = 0; i < mirror_y; i++) {
            result = result.concat([...result].reverse());
        }

        return result;
    }

    // Step 2: Apply mirrors.
    let mirrored = mirrorHorizontal(base);
    mirrored = mirrorVertical(mirrored);

    return mirrored;
}

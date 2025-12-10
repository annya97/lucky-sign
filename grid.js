class Grid {

    /**
	 * Generated grid as table element.
	 *
	 * @type {HTMLTableElement}
	 */
    #container;

    /**
	 * Configuration.
	 *
	 * @type {Object}
	 */
    #config;

    /**
	 * @param {Object} config  Configuration.
	 */
    constructor(config) {
        this.#config = config;

        this.#makeGrid();
        this.#colorGrid();
    }

    /**
	 * Make grid as table element based on generated two-dimensional array.
	 */
    #makeGrid() {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        const grid = this.#generateArray();

        for (const row of grid) {
            const tr = document.createElement('tr');

            for (const value of row) {
                const td = document.createElement('td');

                td.dataset.value = value;

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);

        this.#container = table;
    }

    /**
	 * Generate array from which to make grid.
     * 
     * @returns {Array}  Two-dimensional array.
	 */
    #generateArray() {
        const num_min = 1;
        const num_max = 9;

        let mirror_times;

        switch (Number(this.#config.size)) {
            case GRID_SIZE_1X1:
                mirror_times = 0;
                break;
            case GRID_SIZE_2X2:
                mirror_times = 1;
                break;
            case GRID_SIZE_4X4:
                mirror_times = 2;
                break;
            default:
                console.warn('No such grid size.');
        }

        return generateMirroredArray(num_min, num_max, mirror_times, mirror_times);
    }

    /**
	 * Color grid cells based on parameters from configuration.
	 */
    #colorGrid() {
        const numbers = this.#config.birth_date
            .replace(/\D/g, '')
            .split('')
            .filter((num, i, arr) => arr.indexOf(num) === i)
            .map(num => Number(num));

        const cells = this.#container.querySelectorAll('td');

        for (const cell of cells) {
            if (numbers.includes(Number(cell.dataset.value))) {
                cell.style.backgroundColor = this.#config.color_sign;
            }
            else {
                cell.style.backgroundColor = this.#config.color_background;
            }
        }
    }

    /**
	 * Get container element.
     * 
     * @returns {HTMLTableElement}
	 */
    getContainer() {
        return this.#container;
    }
}

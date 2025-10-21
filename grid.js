class Grid {

    #container;
    #form_props;

    constructor(form_props) {
        this.#form_props = form_props;

        this.#makeGrid();
        this.#colorGrid();
    }

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

    #generateArray() {
        const num_min = 1;
        const num_max = 9;

        let mirror_times;

        switch(Number(this.#form_props.size)) {
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

    #colorGrid() {
        const numbers = this.#form_props.birth_date
            .replace(/\D/g, '')
            .split('')
            .filter((num, i, arr) => arr.indexOf(num) === i)
            .map(num => Number(num));

        const cells = this.#container.querySelectorAll('td');

        switch(Number(this.#form_props.color_mode)) {
            case COLOR_MODE_AUTO:
                console.warn('Automatic colors - to be implemented...');
                break;
            case COLOR_MODE_CUSTOM:
                for (const cell of cells) {
                    if (numbers.includes(Number(cell.dataset.value))) {
                        cell.style.backgroundColor = this.#form_props.custom_color_sign;
                    }
                    else {
                        cell.style.backgroundColor = this.#form_props.custom_color_background;
                    }
                }
                break;
            default:
                console.warn('No such color mode.');
        }
    }

    getContainer() {
        return this.#container;
    }
}

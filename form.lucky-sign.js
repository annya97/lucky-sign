class LuckySignForm extends Form {

    /**
     * @type {HTMLFormElement}
     */
    #form;

    /**
     * @type {Object}
     */
    #listeners;

    /**
     * @type {HTMLElement}
     */
    #colors_modes;

    /**
     * @type {HTMLElement}
     */
    #custom_colors;

    constructor(form) {
        super(form);

        this.#init(form);
        this.#registerListeners();
        this.#activateListeners();
    }

    #init(form) {
        this.#form = form;
        this.#colors_modes = this.#form.querySelector('.colors-modes');
        this.#custom_colors = this.#form.querySelector('.custom-colors');
    }

    #registerListeners() {
        this.#listeners = {
            handleColorsModes: e => {
                if (e.target.name === 'colors') {
                    this.#custom_colors.classList.toggle('d-none', e.target.value !== 'custom');
                }
            }
        };
    }

    #activateListeners() {
        this.#colors_modes.addEventListener('change', this.#listeners.handleColorsModes);
    }
}

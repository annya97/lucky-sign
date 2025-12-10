class LuckySignForm extends Form {

    /**
	 * Form element.
	 *
	 * @type {HTMLFormElement}
	 */
    #form;

    /**
	 * Listeners of form.
	 *
	 * @type {Object}
	 */
    #listeners;

    /**
	 * Elements of form.
	 *
	 * @type {Object}
	 */
    #elements = {
        full_name: null,
        birth_date: null,
        color_sign: null,
        color_background: null,
        auto_colors_container: null,
        auto_colors_selected: null,
        auto_colors_name: null,
        auto_colors_date: null
    };

    /**
	 * @param {HTMLFormElement} form  Form element.
	 */
    constructor(form) {
        super(form);

        this.#form = form;

        this.#init();
        this.#registerListeners();
        this.#activateListeners();
    }

    /**
	 * Initialize form.
	 */
    #init() {
        this.#elements.full_name = this.#form.querySelector('input[name="full_name"]');
        this.#elements.birth_date = this.#form.querySelector('input[name="birth_date"]');
        this.#elements.color_sign = this.#form.querySelector('input[name="color_sign"]');
        this.#elements.color_background = this.#form.querySelector('input[name="color_background"]');
        this.#elements.auto_colors_container = this.#form.querySelector('#auto_colors');
        this.#elements.auto_colors_name = this.#form.querySelector('button[name="auto_colors_name"]');
        this.#elements.auto_colors_date = this.#form.querySelector('button[name="auto_colors_date"]');
        this.#elements.auto_colors_all = [this.#elements.auto_colors_name, this.#elements.auto_colors_date];

        new AirDatepicker(this.#elements.birth_date, {
            locale: DATE_PICKER_LOCALE,
            autoClose: true,
            isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        });

        this.#toggleAutoColorsButtons();
    }

    /**
	 * Register listeners of form.
	 */
    #registerListeners() {
        this.#listeners = {
            fullNameChange: () => {
                this.#toggleAutoColorsButtons();
            },
            birthDateChange: () => {
                this.#toggleAutoColorsButtons();
            },
            colorChange: () => {
                this.#toggleAutoColorsButtons();
            },
            setAutoColors: e => {
                if (e.target === this.#elements.auto_colors_selected) {
                    return;
                }

                if (!luxon.DateTime.fromFormat(this.#elements.birth_date.value, DATE_PICKER_LOCALE.dateFormat).isValid) {
                    alert(`Please input valid date in format "${DATE_PICKER_LOCALE.dateFormat}" to get personalized colors!`);
                    return;
                }

                const birth_date_parts = this.#elements.birth_date.value.split('.');
                const day = Number(birth_date_parts[0]);
                const month = Number(birth_date_parts[1]);
                const year = Number(birth_date_parts[2]);

                switch (e.target) {
                    case this.#elements.auto_colors_name:
                        const name_letters = [...this.#elements.full_name.value.toLowerCase()]
                            .map(char => REPLACEABLE_LETTERS.get(char) || char)
                            .filter(char => ALPHABET.has(char));

                        if (name_letters.length === 0) {
                            alert('Please input your full name to get personalized colors!');
                            return;
                        }

                        const auto_colors_by_name = getAutoColors({day, month, year}, name_letters);

                        this.#elements.color_sign.value = auto_colors_by_name.main;
                        this.#elements.color_background.value = auto_colors_by_name.background;

                        this.#toggleAutoColorsButtons(this.#elements.auto_colors_name);

                        break;
                    case this.#elements.auto_colors_date:
                        const auto_colors_by_date = getAutoColors({day, month, year});

                        this.#elements.color_sign.value = auto_colors_by_date.main;
                        this.#elements.color_background.value = auto_colors_by_date.background;

                        this.#toggleAutoColorsButtons(this.#elements.auto_colors_date);

                        break;
                }
            }
        };
    }

    /**
	 * Activate listeners of form.
	 */
    #activateListeners() {
        this.#elements.full_name.addEventListener('input', this.#listeners.fullNameChange);
        this.#elements.birth_date.addEventListener('change', this.#listeners.birthDateChange);
        this.#elements.color_sign.addEventListener('input', this.#listeners.colorChange);
        this.#elements.color_background.addEventListener('input', this.#listeners.colorChange);
        this.#elements.auto_colors_container.addEventListener('click', this.#listeners.setAutoColors);
    }

    /**
	 * Toggle states of auto colors buttons.
     * 
     * @param {HTMLButtonElement} selected  Selected button.
	 */
    #toggleAutoColorsButtons(selected = null) {
        for (const button of this.#elements.auto_colors_all) {
            button.disabled = false;
            button.textContent = button.dataset.textInitial;
        }

        if (selected !== null && this.#elements.auto_colors_selected !== selected) {
            selected.disabled = true;
            selected.textContent = selected.dataset.textSelected;
        }

        this.#elements.auto_colors_selected = selected;
    }

    /**
	 * Validate form on submission.
     * 
     * @returns {Array}  Array of messages if validation fails, otherwise empty array.
	 */
    _validate() {
        const messages = super._validate();
        const form_props = Object.fromEntries(new FormData(this.#form));

        if (form_props.full_name.trim() === '') {
            messages.push('Please input your full name!');
        }

        if (!luxon.DateTime.fromFormat(form_props.birth_date, DATE_PICKER_LOCALE.dateFormat).isValid) {
            messages.push(`Please input valid date in format "${DATE_PICKER_LOCALE.dateFormat}"!`);
        }

        return messages;
    }

    /**
	 * Action to perform after successful validation.
	 */
    _doAction() {
        super._doAction();

        const form_props = Object.fromEntries(new FormData(this.#form));
        const grid = new Grid(form_props);
        const result = document.getElementById('result');

        result.appendChild(grid.getContainer());
    }
}

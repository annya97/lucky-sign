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
        birth_date: null,
        color_sign: null,
        color_background: null,
        auto_colors: null
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
        this.#elements.birth_date = this.#form.querySelector('input[name="birth_date"]');
        this.#elements.color_sign = this.#form.querySelector('input[name="color_sign"]');
        this.#elements.color_background = this.#form.querySelector('input[name="color_background"]');
        this.#elements.auto_colors = this.#form.querySelector('button[name="auto_colors"]');

        new AirDatepicker(this.#elements.birth_date, {
            locale: DATE_PICKER_LOCALE,
            autoClose: true,
            isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        });

        this.#enableAutoColorsButton();
    }

    /**
	 * Register listeners of form.
	 */
    #registerListeners() {
        this.#listeners = {
            birthDateChange: () => {
                this.#enableAutoColorsButton();
            },
            colorChange: () => {
                this.#enableAutoColorsButton();
            },
            setAutoColors: () => {
                if (!luxon.DateTime.fromFormat(this.#elements.birth_date.value, DATE_PICKER_LOCALE.dateFormat).isValid) {
                    alert(`Please input valid date in format "${DATE_PICKER_LOCALE.dateFormat}" to get personalized colors!`);
                    return;
                }

                const birth_date_parts = this.#elements.birth_date.value.split('.');
                const day = Number(birth_date_parts[0]);
                const month = Number(birth_date_parts[1]);
                const year = Number(birth_date_parts[2]);
                const auto_colors = getAutoColors(day, month, year);

                this.#elements.color_sign.value = auto_colors.main;
                this.#elements.color_background.value = auto_colors.background;

                this.#enableAutoColorsButton(false);
            }
        };
    }

    /**
	 * Activate listeners of form.
	 */
    #activateListeners() {
        this.#elements.birth_date.addEventListener('change', this.#listeners.birthDateChange);
        this.#elements.color_sign.addEventListener('change', this.#listeners.colorChange);
        this.#elements.color_background.addEventListener('change', this.#listeners.colorChange);
        this.#elements.auto_colors.addEventListener('click', this.#listeners.setAutoColors);
    }

    /**
	 * Toggle state of auto colors button.
     * 
     * @param {boolean} enable  Whether to enable or disable button.
	 */
    #enableAutoColorsButton(enable = true) {
        this.#elements.auto_colors.disabled = !enable;
        this.#elements.auto_colors.textContent = enable
            ? '✨ Personalize colors ✨'
            : '✨ Colors are personalized ✨';
    }

    /**
	 * Validate form on submission.
     * 
     * @returns {Array}  Array of messages if validation fails, otherwise empty array.
	 */
    _validate() {
        return super._validate();
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

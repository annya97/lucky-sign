class LuckySignForm extends Form {

    #form;
    #listeners;
    #elements = {
        birth_date: null,
        color_sign: null,
        color_background: null,
        auto_colors: null
    };

    constructor(form) {
        super(form);

        this.#form = form;

        this.#init();
        this.#registerListeners();
        this.#activateListeners();
    }

    #init() {
        this.#elements.birth_date = this.#form.querySelector('input[name="birth_date"]');
        this.#elements.color_sign = this.#form.querySelector('input[name="color_sign"]');
        this.#elements.color_background = this.#form.querySelector('input[name="color_background"]');
        this.#elements.auto_colors = this.#form.querySelector('button[name="auto_colors"]');

        new AirDatepicker('#birth-date', {
            locale: DATE_PICKER_LOCALE,
            autoClose: true,
            isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        });

        this.#enableAutoColorsButton();
    }

    #registerListeners() {
        this.#listeners = {
            birthDateChange: () => {
                this.#enableAutoColorsButton();
            },
            colorChange: () => {
                this.#enableAutoColorsButton();
            },
            setAutoColors: () => {
                if (!luxon.DateTime.fromFormat(this.#elements.birth_date.value, 'dd.MM.yyyy.').isValid) {
                    alert('Please input valid date in format "dd.MM.yyyy." to get personalized colors!');
                    return;
                }

                const [day, month, year] = this.#elements.birth_date.value.split('.');

                const auto_colors = getAutoColors(day, month, year);

                this.#elements.color_sign.value = auto_colors.main;
                this.#elements.color_background.value = auto_colors.background;

                this.#enableAutoColorsButton(false);
            }
        };
    }

    #activateListeners() {
        this.#elements.birth_date.addEventListener('change', this.#listeners.birthDateChange);
        this.#elements.color_sign.addEventListener('change', this.#listeners.colorChange);
        this.#elements.color_background.addEventListener('change', this.#listeners.colorChange);
        this.#elements.auto_colors.addEventListener('click', this.#listeners.setAutoColors);
    }

    #enableAutoColorsButton(enable = true) {
        this.#elements.auto_colors.disabled = !enable;
        this.#elements.auto_colors.textContent = enable
            ? '✨ Personalize colors ✨'
            : '✨ Colors are personalized ✨';
    }

    _validate() {
        return super._validate();
    }

    _doAction() {
        super._doAction();

        const form_props = Object.fromEntries(new FormData(this.#form));
        const grid = new Grid(form_props);
        const result = document.getElementById('result');

        result.appendChild(grid.getContainer());
    }
}

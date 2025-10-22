class LuckySignForm extends Form {

    #form;

    constructor(form) {
        super(form);

        this.#form = form;

        this.#init();
    }

    #init() {
        new AirDatepicker('#birth-date', {
            locale: DATE_PICKER_LOCALE,
            autoClose: true,
            isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        });
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

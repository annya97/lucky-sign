class LuckySignForm extends Form {

    constructor(form) {
        super(form);

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
        return true;
    }

    _doAction() {
        const form_data = new FormData(this._form);
        const form_props = Object.fromEntries(form_data);
        const grid = new Grid(form_props);

        const result = document.getElementById('result');
        const result_wrap = document.getElementById('result-wrap');

        result.innerHTML = '';
        result.appendChild(grid.getContainer());

        result_wrap.classList.remove('d-none');
        result_wrap.classList.add('d-flex');
    }
}

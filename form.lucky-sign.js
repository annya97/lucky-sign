class LuckySignForm extends Form {

    constructor(form) {
        super(form);

        this.#init();
    }

    #init() {
        new AirDatepicker('#birth-date', {
            locale: date_picker_locale,
            autoClose: true,
            isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        });
    }
}

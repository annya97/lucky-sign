class Form {

    #form;
    #listeners;

    constructor(form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new Error('Incorrect form element provided.');
        }

        this.#form = form;

        this.#registerListeners();
        this.#activateListeners();
    }

    #registerListeners() {
        this.#listeners = {
            submit: e => {
                e.preventDefault();

                const result_wrap = document.getElementById('result-wrap');
                const result = document.getElementById('result');
                const errors = this.#form.querySelector('.errors');

                result_wrap.classList.add('d-none');
                result.innerHTML = '';
                errors.classList.add('d-none');
                errors.innerHTML = '';

                const messages = this._validate();

                if (messages.length > 0) {
                    errors.innerHTML = messages.flatMap(x => ['<br>', x]).slice(1).join('');
                    errors.classList.remove('d-none');
                }
                else {
                    result_wrap.classList.remove('d-none');
                    result_wrap.classList.add('d-flex');

                    this._doAction();
                }
            }
        };
    }

    #activateListeners() {
        this.#form
            .querySelector('button[name="draw"]')
            .addEventListener('click', this.#listeners.submit);
    }

    _validate() {
        const messages = [];
        const form_props = Object.fromEntries(new FormData(this.#form));

        if (!luxon.DateTime.fromFormat(form_props.birth_date, DATE_PICKER_LOCALE.dateFormat).isValid) {
            messages.push(`Please input valid date in format "${DATE_PICKER_LOCALE.dateFormat}"!`);
        }

        return messages;
    }

    _doAction() {}
}

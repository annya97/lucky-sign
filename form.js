class Form {

    constructor(form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new Error('Incorrect form element provided.');
        }

        this.#init(form);
        this.#registerListeners();
        this.#activateListeners();
    }

    #init(form) {
        this._form = form;
        this._submit_button = this._form.querySelector('button[type="submit"]');
        this._messages = this._form.querySelector('.messages');
        this._result_wrap = document.getElementById('result-wrap');
        this._result = document.getElementById('result');
    }

    #registerListeners() {
        this._listeners = {
            submit: e => {
                e.preventDefault();

                this._result_wrap.classList.add('d-none');
                this._result.innerHTML = '';
                this._messages.classList.add('d-none');
                this._messages.innerHTML = '';

                const messages = this._validate();

                if (messages.length > 0) {
                    this._messages.innerHTML = messages.flatMap(x => ['<br>', x]).slice(1).join('');
                    this._messages.classList.remove('d-none');
                }
                else {
                    this._result_wrap.classList.remove('d-none');
                    this._result_wrap.classList.add('d-flex');

                    this._doAction();
                }
            }
        };
    }

    #activateListeners() {
        this._submit_button.addEventListener('click', this._listeners.submit);
    }

    _validate() {
        const messages = [];

        const form_props = Object.fromEntries(new FormData(this._form));
        console.log('form_props', form_props);

        if (!luxon.DateTime.fromFormat(form_props.birth_date, 'dd.MM.yyyy.').isValid) {
            messages.push('Please input valid date in format "dd.MM.yyyy."!');
        }

        return messages;
    }

    _doAction() {}
}

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
    }

    #registerListeners() {
        this._listeners = {
            submit: e => {
                e.preventDefault();

                if (this._validate()) {
                    this._doAction();
                }
            }
        };
    }

    #activateListeners() {
        this._submit_button.addEventListener('click', this._listeners.submit);
    }

    _validate() {
        return true;
    }

    _doAction() {}
}

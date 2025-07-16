class Form {

    /**
     * @type {HTMLFormElement}
     */
    #form;

    /**
     * @type {Object}
     */
    #listeners;

    /**
     * @type {HTMLButtonElement}
     */
    #submit_button;

    constructor(form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new Error('Incorrect form element provided.');
        }

        this.#init(form);
        this.#registerListeners();
        this.#activateListeners();
    }

    #init(form) {
        this.#form = form;
        this.#submit_button = this.#form.querySelector('button[type="submit"]');
    }

    #registerListeners() {
        this.#listeners = {
            submit: e => {
                e.preventDefault();
            }
        };
    }

    #activateListeners() {
        this.#submit_button.addEventListener('click', this.#listeners.submit);
    }
}

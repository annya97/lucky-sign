class Form {

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
	 * @param {HTMLFormElement} form  Form element.
	 */
    constructor(form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new Error('Incorrect form element provided.');
        }

        this.#form = form;

        this.#registerListeners();
        this.#activateListeners();
    }

    /**
	 * Register listeners of form.
	 */
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

                scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
            }
        };
    }

    /**
	 * Activate listeners of form.
	 */
    #activateListeners() {
        this.#form
            .querySelector('button[name="draw"]')
            .addEventListener('click', this.#listeners.submit);
    }

    /**
	 * Validate form on submission.
     * Must be implemented in child class.
     * 
     * @returns {Array}  Array of messages if validation fails, otherwise empty array.
	 */
    _validate() {
        return [];
    }

    /**
	 * Action to perform after successful validation.
     * Must be implemented in child class.
	 */
    _doAction() {}
}

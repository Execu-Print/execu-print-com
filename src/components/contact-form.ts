import { LitElement, html, css } from 'lit';

export class ContactForm extends LitElement {
    static styles = css`
        form {
            display: flex;
            flex-direction: column;
            /* max-width: 400px; */
            margin: auto;
            width: 100%;
        }
        label {
            margin-bottom: 5px;
            font-weight: bold;
            width: 100%;
        }
        input, textarea {
            margin-bottom: 15px;
            padding: 8px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100%;
        }
        button {
            padding: 10px;
            font-size: 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            min-width: 110px;
            width: 20%;
        }
        button:hover {
            background-color: #0056b3;
        }


        button:disabled,
                button[disabled]{
                border: 1px solid #999999;
                background-color: #cccccc;
                color: #666666;
        }



        /* The SIMPLE-TOAST - position it at the bottom and in the middle of the screen */
                #simpleToast {
                        visibility: hidden; /* Hidden by default. Visible on click */
                        min-width: 250px; /* Set a default minimum width */
                        margin-left: -125px; /* Divide value of min-width by 2 */
                        color: #fff; /* White text color */
                        text-align: center; /* Centered text */
                        border-radius: 2px; /* Rounded borders */
                        padding: 16px; /* Padding */
                        position: fixed; /* Sit on top of the screen */
                        z-index: 1; /* Add a z-index if needed */
                        left: 50%; /* Center the snackbar */
                        bottom: 30px; /* 30px from the bottom */
                        font-family: monospace;
                        display: inline-flex;
                        line-hight: 12px
                }
                #simpleToast span {
                        margin-left: 12px;
                        margin-top: 2px;
                }

                /* Show the SIMPLE-TOAST when clicking on a button (class added with JavaScript) */
                #simpleToast.show {
                        visibility: visible; /* Show the SIMPLE-TOAST */
                        /* Add animation: Take 0.5 seconds to fade in and out the SIMPLE-TOAST.
                        However, delay the fade out process for 2.5 seconds */
                        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
                        animation: fadein 0.5s, fadeout 0.5s 2.5s;
                }

                #simpleToast.success {
                        background-color: green;
                }

                #simpleToast.failure {
                        background-color: red
                }

                /* Animations to fade the SIMPLE-TOAST in and out */
                @-webkit-keyframes fadein {
                        from {bottom: 0; opacity: 0;}
                        to {bottom: 30px; opacity: 1;}
                }

                @keyframes fadein {
                        from {bottom: 0; opacity: 0;}
                        to {bottom: 30px; opacity: 1;}
                }

                @-webkit-keyframes fadeout {
                        from {bottom: 30px; opacity: 1;}
                        to {bottom: 0; opacity: 0;}
                }

                @keyframes fadeout {
                        from {bottom: 30px; opacity: 1;}
                        to {bottom: 0; opacity: 0;}
                }


    `;

    formValid = true;

    formIds = [
        'contact-form',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'submit',
    ]
    // turnstileToken = null;


    changeButtonState() {
        console.log('Checking button status')
        const button = this.renderRoot.querySelector("button");
        if (this.formValid) {
            button.disabled = null
        } else {
            button.disabled = true;
        }
    }

    render() {

        console.log('Rendering contact form')
        return html`
            <form id="contact-form" @submit="${this.handleSubmit}" novalidate>
                <div>
                    <label for="name">Your Name*</label>
                    <input type="text" id="name" name="name" required aria-required="true" aria-describedby="name-desc" />
                    <!-- <span id="name-desc" class="sr-only">Please enter your full name</span> -->
                </div>

                <div>
                    <label for="email">Your Email*</label>
                    <input type="email" @blur="${this.onBlur}" id="email" name="email" required aria-required="true" aria-describedby="email-desc" />
                    <!-- <span id="email-desc" class="sr-only">Please enter a valid email address</span> -->
                </div>

                <div>
                    <label for="phone">Your Phone number* (Ex: 262-367-0390)</label>
                    <input type="phone" pattern="[0-9]{3}-?[0-9]{3}-?[0-9]{4}" @blur="${this.onBlur}" id="phone" name="phone" required aria-required="true" aria-describedby="phone-desc" />
                </div>

                <div>
                    <label for="subject">Subject</label>
                    <input type="text" @blur="${this.onBlur}" id="subject" name="subject" required aria-required="false" aria-describedby="subject-desc" />
                    <!-- <span id="subject-desc" class="sr-only">Please enter the subject of your message</span> -->
                </div>

                <div>
                    <label for="message">Your Message</label>
                    <textarea id="message" @blur="${this.onBlur}" name="message" rows="5" required aria-required="false" aria-describedby="message-desc"></textarea>
                    <!-- <span id="message-desc" class="sr-only">Please enter your message</span> -->
                </div>

                <button type="submit" id="submit">Submit</button>
            </form>

                <div id="simpleToast">
                        <span></span>
                </div>
        `;

        // setTimeout(() => {
        //     // const capchaTarget = this.shadowRoot?.querySelector('#turnstile-target')
        //     window.turn.render('#turnstile-target', {
        //         sitekey: "0x4AAAAAABXgOp55dr-OXNph",
        //         callback: function (token) {
        //             console.log(`Challenge Success ${token}`);
        //         },
        //     });
        // })
    }

    onBlur(evnt: Event) {
        console.log('blur event');

        if (!this.formValid) {
            const formEl = this.renderRoot.querySelector("#contact-form");
            if (formEl) {
                this.formValid = formEl.checkValidity();
                this.changeButtonState()
            }
        }

        // const name = document.getElementById('name');
        const fields = this.renderRoot.querySelectorAll('input');
        const messageField = this.renderRoot.querySelector('textarea');
        const context: { [field: string]: string } = {
            page: window.location.pathname,
            message: messageField?.value || ''
        }
        Array.from(fields).forEach(field => context[field.id] = field.value);

        const hasValues = Object.keys(context).some(key => (context[key] || '').trim());

        if (hasValues) {
            (window as any).track('contact form blur', context);
        }
    }

    popToast(msg: string, status: 'success' | 'failure') {
        // Get the SIMPLE-TOAST DIV
        const toastEl = this.renderRoot.querySelector("#simpleToast");
        if (!toastEl) { return; }
        // Add the "show" class to DIV
        toastEl.innerHTML = `<span>${msg}</span>`
        toastEl.className = `${status} show`;
        // After 3 seconds, remove the show class from DIV

        return new Promise(resolve => {
            setTimeout(() => {
                toastEl.className = toastEl.className.replace("show", "").replace(status, '');
                toastEl.innerHTML = '<span></span>';
                resolve(null);
            }, 3000);
        });

    }


    sendPost(url: string, body: object) {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        }
        if (window.location.host !== 'execu-print.com' || window.__astro_dev_toolbar__) {
            console.log(window.location.host)
            headers.debug = window.location.host
        }
        return fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
    }

    async handleSubmit(event: any) {
        const button = this.renderRoot.querySelector("button");
        event.preventDefault();
        const form = event.target;


        this.formValid = form.checkValidity();
        this.changeButtonState()

        if (this.formValid) {
            if (button) {
                console.log('disabling button for submit')
                button.disabled = true;
            }
            // Form is valid, handle form submission
            const formData = new FormData(form);
            const body = Object.fromEntries(formData.entries());

            for (const inputId of this.formIds) {
                const inputEl = this.renderRoot.querySelector(`#${inputId}`);
                inputEl.disabled = true;
            }

            console.log('Form data:', body);
            const pathname = window.location.pathname;
            body.path = pathname;

            let err: any;
            (window as any).turn.render('#turnstile-target', {
                sitekey: "0x4AAAAAABXgOp55dr-OXNph",
                callback: (token: string) => {
                    body.turnstileToken = token;
                    this.challengePassed(body);
                },
                'error-callback': (err) => {
                    for (const inputId of this.formIds) {
                        const inputEl = this.renderRoot.querySelector(`#${inputId}`);
                        inputEl.disabled = null;
                    }

                    (window as any).track('contact form submit' + (err ? ' - failure' : ''));
                    this.popToast('Form could not be submitted, please email us at customerservice@execu-print.com', 'failure');
                }
            });


        } else {
            // Form is invalid, show validation errors
            form.reportValidity();
        }
    }

    async challengePassed(body: object) {
        (window as any).turn.remove('#turnstile-target');
        try {
            const url = (window.location.host === 'localhost:4321' || window.__astro_dev_toolbar__)
                ? 'https://execu-print-contact-worker.execuprint-it.workers.dev/api/contact' //'https://execu-print.com/api/contact'
                : '/api/contact'
            await this.sendPost(url, body);
            for (const inputId of this.formIds) {
                const inputEl = this.renderRoot.querySelector(`#${inputId}`);
                inputEl.value = '';
                inputEl.text = '';
            }
            this.popToast('Form successfully submitted', 'success');
        } catch (e) {
            console.warn('post or toast failed', e)

        } finally {
            for (const inputId of this.formIds) {
                const inputEl = this.renderRoot.querySelector(`#${inputId}`);
                inputEl.disabled = null;
            }
        }

    }
}

customElements.define('contact-form', ContactForm);

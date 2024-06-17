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

  render() {
    return html`
      <form @submit="${this.handleSubmit}" novalidate>
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
          <label for="subject">Subject</label>
          <input type="text" @blur="${this.onBlur}" id="subject" name="subject" required aria-required="false" aria-describedby="subject-desc" />
          <!-- <span id="subject-desc" class="sr-only">Please enter the subject of your message</span> -->
        </div>

        <div>
          <label for="message">Your Message</label>
          <textarea id="message" @blur="${this.onBlur}" name="message" rows="5" required aria-required="false" aria-describedby="message-desc"></textarea>
          <!-- <span id="message-desc" class="sr-only">Please enter your message</span> -->
        </div>

        <button type="submit">Submit</button>
      </form>

        <div id="simpleToast">
            <span></span>
        </div>
    `;
  }

  onBlur(evnt) {
    console.log('blur event');

    // const name = document.getElementById('name');
    const fields = this.renderRoot.querySelectorAll('input');
    const messageField = this.renderRoot.querySelector('textarea');
    const context: {[field: string]: string} = {
        page: window.location.pathname,
        message: messageField?.value || ''
    }
    Array.from(fields).forEach(field => context[field.id] = field.value);

    const hasValues = Object.keys(context).some(key => (context[key] || '').trim());

    if (hasValues) {
        window.track('contact form blur', context);
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
    return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  }

  async handleSubmit(event: any) {
    const button = this.renderRoot.querySelector("button");
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity()) {
        if (button) {
            button.disabled = true;
        }
      // Form is valid, handle form submission
      const formData = new FormData(form);
      const body = Object.fromEntries(formData.entries());
      console.log('Form data:', body);
      const pathname = window.location.pathname;
      body.path = pathname;

      let err: any;
        try {
            await this.sendPost('/api/contact', body);
            await this.popToast('Form successfully submitted', 'success');
        } catch (e: any) {
            err = e;
            await this.popToast('Form could not be submitted, please email us at customerservice@execu-print.com', 'failure');
        } finally {
            window.track('contact form submit' + (err ? ' - failure' : ''));

            if (button) {
                button.disabled = null;
            }
        }


    } else {
      // Form is invalid, show validation errors
      form.reportValidity();
    }
  }
}

customElements.define('contact-form', ContactForm);

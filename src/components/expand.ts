import { LitElement, css, html } from "lit";

export class Expand extends LitElement {

static properties = {
    isOpen: { type: Boolean },
    _resizeOnShowTimeoutToken: {type: Number}
  };

  constructor() {
    super();
    this.isOpen = false;
  }

    static styles = css`
        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .wrapper {
            // border: 1px solid #eee;
            margin: 5px;
            box-shadow: rgb(0, 0, 0) 2px 4px 5px;
        }
    `;


    override render() {
        if (this.isOpen) {
            return html`<div class="wrapper">
                <slot name="target"></slot>
            </div>
            <div class="backdrop" @click="${this.toggle}">
                <slot name="expand"></slot>
            </div>`;
        }
        return html`<div class="wrapper" @click="${this.toggle}"><slot name="target"></slot></div>`;
    }

    private toggle() {
        this.isOpen = !this.isOpen;
        if (window) {
            try {
                window.track('Toggle image');
            } catch (e) {
                console.debug('Error logging from expand', e)
            }

        }

        console.log('toggling', this.isOpen)

        if (this.isOpen) {
            this._resizeOnShowTimeoutToken = setTimeout(this._resizeOnShow, 100)
        } else {
            clearTimeout(this._resizeOnShowTimeoutToken)
        }

    }

    private _resizeOnShow = () => {
        const slot = this.shadowRoot.querySelector('slot[name="expand"]');
        const children = slot?.assignedElements();

        const img = children[0]?.querySelector('.expanded-image');

        if (img) {
            const { height, width } = img;
            const {innerHeight, innerWidth} = window;
            const imgAspectRatio = width / height;
            const browserAspectRatio = innerWidth / innerHeight;

            if (imgAspectRatio < browserAspectRatio) {
                img.classList.add('imgTooTall')
            }
        }
    }
}
customElements.define('gallery-expand', Expand);

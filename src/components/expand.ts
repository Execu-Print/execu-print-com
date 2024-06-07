import { LitElement, css, html } from "lit";

export class Expand extends LitElement {

static properties = {
    isOpen: { type: Boolean }
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
            return html`<div class="wrapper"><slot name="target"></slot></div>
            <div class="backdrop" @click="${this.toggle}"><slot name="expand"></slot></div>`;
        }
        return html`<div class="wrapper" @click="${this.toggle}"><slot name="target"></slot></div>`;
    }

    private toggle() {
        this.isOpen = !this.isOpen;
    }
}
customElements.define('gallery-expand', Expand);

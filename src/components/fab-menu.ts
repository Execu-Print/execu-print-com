import { LitElement, css, html, unsafeCSS } from "lit";

const epBlue = "#39b9f9";
const epPink = "rgb(242, 55, 161)";
const epYellow = "rgb(247, 212, 56)";

interface DropdownConfig {
    title: string;
    children: {
        title: string;
        link: string;
    }[];
}

export class FabMenu extends LitElement {

static properties = {
    isOpen: { type: Boolean },
    items: { type: Array }
  };

  constructor() {
    super();
    this.isOpen = false;
  }

    static styles = unsafeCSS`
        .fab {
            height: 80px;
            width: 80px;
            border-radius: 50px;

            cursor: pointer;

            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: #39b9f9;
            color: white;
            font-size: 24pt;

            box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, .2);
        }

        .fab-open {
            width: unset;
            height: unset;
            left: 10px;
        }

        .menu {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: flex-end;
            align-items: stretch;
            align-content: stretch;
        }

        .center {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        a {
            color: white;
            min-height: 60px;
            text-decoration: none;
        }

        .close-row {
            padding-right: 32px;
            text-align: right;
            padding-bottom: 20px;
        }

        // collapsible below
        .wrap-collabsible {
            margin-bottom: 1.2rem 0;
          }

          input[type='checkbox'] {
            display: none;
          }

          .lbl-toggle {
            display: block;

            text-align: center;

            padding: 1rem;

            color: white;
            background: ${epPink};

            cursor: pointer;

            border-radius: 7px;
            transition: all 0.25s ease-out;
          }

          .lbl-toggle:hover {
            color: #7C5A0B;
          }

          .lbl-toggle::before {
            content: ' ';
            display: inline-block;

            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 5px solid currentColor;
            vertical-align: middle;
            margin-right: .7rem;
            transform: translateY(-2px);

            transition: transform .2s ease-out;
          }

          .toggle:checked + .lbl-toggle::before {
            transform: rotate(90deg) translateX(-3px);
          }

          .collapsible-content {
            max-height: 0px;
            overflow: hidden;
            transition: max-height .25s ease-in-out;
          }

          .toggle:checked + .lbl-toggle + .collapsible-content {
            max-height: 100vh;
          }

          .toggle:checked + .lbl-toggle {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
          }

          .collapsible-content .content-inner {
            background-color: rgb(242, 55, 161);
            border-bottom: 1px solid rgba(250, 224, 66, .45);
            border-bottom-left-radius: 7px;
            border-bottom-right-radius: 7px;
            padding: .5rem 1rem;
          }
    `;

    private dropdown(data: DropdownConfig) {
        return html`
        <div class="wrap-collabsible">
        <input id="collapsible-${data.title}" class="toggle" type="checkbox">
        <label for="collapsible-${data.title}" class="lbl-toggle">${data.title}</label>
        <div class="collapsible-content">
            <div class="content-inner">
            ${
                data.children.map(child => html`
                    <a class="center" href="${child.link}">${child.title}</a>
                `)
            }
            </div>
        </div>
        </div>`;
    }


    override render() {
        if (this.isOpen) {
            return html
            `<div class="fab fab-open">
                <div class="menu">
                    <a class="center" href="/">Home</a>
                    ${
                        this.items.map(item => item.children
                            ? this.dropdown(item)
                            : html`<a class="center" href="${item.link}">${item.title}</a>`
                        )
                    }
                </div>
                <div class="close-row" @click="${this.toggle}">
                    X
                </div>
            </div>
            `;
        }
        return html
        `<div class="fab center" @click="${this.toggle}">
            ≡
        </div>`;
    }

    // 🍔❌🟰⁝≣≡⫴

    private toggle() {
        this.isOpen = !this.isOpen;
    }
}
customElements.define('fab-menu', FabMenu);

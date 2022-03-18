import { LitElement, html, css } from "lit";
import { customElement, query, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

// <check-box
// label="Save current price along with the note."
// @checked=${(e) => {
// this.includePrice = e.detail;
// }}
// ></check-box>

@customElement("check-box")
export class CheckBox extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: true })
    checked: boolean = false;

    @property({ type: Boolean, reflect: true })
    disabled: boolean = false;

    @property({ type: String })
    label: string = "";

    @query("input#checkInput")
    _input;

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            *,
            *:before,
            *:after {
                box-sizing: border-box;
            }

            form {
                display: grid;
                /* place-content: center; */
            }

            .form-control {
                font-family: system-ui, sans-serif;
                font-size: 1.2rem;
                line-height: 1.2rem;
                display: grid;
                grid-template-columns: 1em auto;
                gap: 0.5em;
                color: var(--lumo-tertiary-text-color);
            }

            .form-control span {
                color: var(--lumo-contrast);
            }

            .form-control--disabled {
                color: var(--lumo-shade-20pct);
                cursor: not-allowed;
            }

            .form-control--disabled span {
                color: var(--lumo-shade-20pct);
            }

            input[type="checkbox"] {
                /* Add if not using autoprefixer */
                -webkit-appearance: none;
                /* Remove most all native input styles */
                appearance: none;
                /* For iOS < 15 */
                background-color: var(--form-background);
                /* Not removed via appearance */
                margin: 0;

                font: inherit;
                color: currentColor;

                width: 1.15em;
                height: 1.15em;
                border: 0.15em solid var(--lumo-secondary-text-color);
                border-radius: 0.15em;
                transform: translateY(-0.075em);

                display: grid;
                place-content: center;
            }

            input[type="checkbox"]::before {
                content: "";
                width: 0.65em;
                height: 0.65em;
                clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                transform: scale(0);
                transform-origin: bottom left;
                transition: 120ms transform ease-in-out;
                box-shadow: inset 1em 1em rebeccapurple;
            }

            input[type="checkbox"]:checked::before {
                transform: scale(1);
            }

            input[type="checkbox"]:focus {
                outline: max(2px, 0.15em) solid currentColor;
                outline-offset: max(2px, 0.15em);
            }

            input[type="checkbox"]:disabled {
                border: 0.15em solid var(--lumo-shade-20pct);
                color: var(--lumo-shade-20pct);
                cursor: not-allowed;
            }

            label {
                margin-bottom: 0.3rem;
                padding: 1rem;
            }

            .labelText {
                font-size: var(--lumo-font-size-xs);
            }
        `,
    ];

    // -- Lifecycle function -- //

    firstUpdated(): void {
        this._input.disabled = this.disabled;
        this._input.checked = this.checked;
    }

    // -- Functions -- //
    handleClick() {
        const checked = this._input.checked ? true : false;
        var event = new CustomEvent("checked", { detail: checked });
        this.dispatchEvent(event);
    }

    // -- Main Render -- //
    render() {
        const classes = {
            "form-control": true,
            "form-control--disabled": this.disabled,
        };

        if (this._input) {
            this._input.disabled = this.disabled;
        }

        return html`
            <form action="">
                <label class="${classMap(classes)}">
                    <input id="checkInput" type="checkbox" name="checkbox" @click="${this.handleClick}" />
                    <span class="labelText">${this.label}</span>
                </label>
            </form>
        `;
    }
}

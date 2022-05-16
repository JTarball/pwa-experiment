import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

@customElement("pass-fail")
export class PassFail extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: false })
    pass: boolean = false;

    @state()
    text: String = "";

    @query("div.box")
    _box?: Element;

    @query("div.text")
    _text?: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            .box {
                --grade-fill-color: grey;
                height: 22px;
                width: 46px;
                padding-bottom: 15%;
                position: relative;

                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                display: flex;
                flex-direction: column;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0.07);
                background: var(--grade-fill-color);
            }
            .box .text {
                --grade-text-color: black;
                position: absolute;
                transform: translate(-50%, -50%);
                top: 50%;
                left: 50%;
                color: var(--grade-text-color);
                font-size: var(--lumo-font-size-s);
            }
        `,
    ];

    // -- Lifecycle function -- //

    calculatePassFail() {
        /* Uses: https://www.schemecolor.com/red-orange-green-gradient.php */

        if (this._box && this._text) {
            if (this.pass) {
                this.text = "Pass";
                this._box.style.setProperty("--grade-fill-color", "#69B34C");
                this._text.style.setProperty("--grade-text-color", "white");
            } else {
                this.text = "Fail";
                this._box.style.setProperty("--grade-fill-color", "#FAB733");
                this._text.style.setProperty("--grade-text-color", "black");
            }
        }
    }

    firstUpdated() {
        this.calculatePassFail();
    }
    update(changedProperties) {
        this.calculatePassFail();
        super.update(changedProperties);
    }

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        return html`
            <div class="box">
                <div class="text">${this.text}</div>
            </div>
        `;
    }
}

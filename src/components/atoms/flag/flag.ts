import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

@customElement("flag-box")
export class FlagBox extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Number })
    score?: number;

    @property({ type: Number })
    value?: number;

    @state()
    grade: String = "";

    @query("div.box")
    _box?: Element;

    @query(".circle")
    _circle?: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            .box {
                --grade-fill-color: grey;
                height: 25px;

                padding-bottom: 8px;
                position: relative;

                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                display: flex;
                flex-direction: column;
                border-radius: 4px;
                /* border: 1px solid var(--grade-fill-color); */
                border: 1px solid rgba(0, 0, 0, 0.07);
                /* background: var(--grade-fill-color); */
                background-color: #f7f8fa;
                width: 60px;
            }
            .box .text {
                position: absolute;
                transform: translate(-50%, -50%);
                top: 50%;
                left: 50%;
                color: #bfc1c6;
                font-size: var(--lumo-font-size-micro);
            }
            .box .value {
                color: var(--grade-fill-color);
            }

            .circle {
                display: inline-block;
                background: var(--grade-fill-color);
                height: 14px;
                width: 14px;
                border-radius: 50%;
                vertical-align: middle;
                margin: auto;
            }
        `,
    ];

    // -- Lifecycle function -- //

    validateAllProps() {
        assert(this.score != undefined, "Score property must be set.");
        assert(this.score <= 5, `Score property is not valid: ${this.score}. (Possible values 1-5)`);
        assert(this.score > 0, `Score property is not valid: ${this.score}. (Possible values 1-5)`);
    }

    calculateScore() {
        /*
           Color scheme: https://www.schemecolor.com/red-orange-green-gradient.php
        */
        if (this.score && this._circle) {
            switch (this.score) {
                case 1:
                    this._circle.style.setProperty("--grade-fill-color", "#69B34C");
                    this.grade = "V GOOD";
                    break;
                case 2:
                    this._circle.style.setProperty("--grade-fill-color", "#69B34C");
                    this.grade = "GOOD";
                    break;
                case 3:
                    this._circle.style.setProperty("--grade-fill-color", "#FAB733");
                    this.grade = "AVERAGE";
                    break;
                case 4:
                    this._circle.style.setProperty("--grade-fill-color", "#FF4E11");
                    this.grade = "POOR";
                    break;
                case 5:
                    this._circle.style.setProperty("--grade-fill-color", "#FF0D0D");
                    this.grade = "VERY POOR";
                    break;
            }
        }
    }

    firstUpdated() {
        this.calculateScore();
    }
    update(changedProperties) {
        this.calculateScore();
        super.update(changedProperties);
    }

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        this.validateAllProps();

        return html`
            <vaadin-horizontal-layout>
                <div class="box">
                    <div class="text">
                        ${this.grade}
                        <!--<span class="value">${this.value}</span>-->
                    </div>
                </div>
                <span class="circle"></span>
            </vaadin-horizontal-layout>
        `;
    }
}

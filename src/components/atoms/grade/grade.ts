import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

@customElement("grade-box")
export class GradeBox extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Number })
    score?: number;

    @state()
    grade: String = "";

    @query("div.box")
    _box?: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            .box {
                --grade-fill-color: grey;
                height: 30px;
                width: 35px;
                padding-bottom: 20%;
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
                position: absolute;
                transform: translate(-50%, -50%);
                top: 50%;
                left: 50%;
                color: white;
                font-size: var(--lumo-font-size-m);
            }
        `,
    ];

    // -- Lifecycle function -- //

    validateAllProps() {
        assert(this.score != undefined, "Score property must be set.");
        assert(this.score <= 100, "Score property is not valid. (Possible values 0-100)");
        assert(this.score >= 0, "Score property is not valid. (Possible values 0-100)");
    }

    calculateScore() {
        /*
            https://www.schemecolor.com/red-orange-green-gradient.php
            A+ 11  91.63
            A  10  83.30
            A-  9  74.97
            B+  8  66.64
            B   7  58.31
            C+  6  49.98
            C   5  41.65
            D+  4  33.32
            D   3  24.99
            E   2  16.66
            F   1  8.33
        */
        if (this.score && this._box) {
            if (this.score >= 91.63) {
                this._box.style.setProperty("--grade-fill-color", "#69B34C");
                this.grade = "A+";
            } else if (this.score >= 83.3) {
                this._box.style.setProperty("--grade-fill-color", "#69B34C");
                this.grade = "A-";
            } else if (this.score >= 74.97) {
                this._box.style.setProperty("--grade-fill-color", "#69B34C");
                this.grade = "A";
            } else if (this.score >= 66.64) {
                this._box.style.setProperty("--grade-fill-color", "#ACB334");
                this.grade = "B+";
            } else if (this.score >= 58.31) {
                this._box.style.setProperty("--grade-fill-color", "#ACB334");
                this.grade = "B";
            } else if (this.score >= 49.98) {
                this._box.style.setProperty("--grade-fill-color", "#FAB733");
                this.grade = "C+";
            } else if (this.score >= 41.65) {
                this._box.style.setProperty("--grade-fill-color", "#FAB733");
                this.grade = "C";
            } else if (this.score >= 33.32) {
                this._box.style.setProperty("--grade-fill-color", "#FF8E15");
                this.grade = "D+";
            } else if (this.score >= 24.99) {
                this._box.style.setProperty("--grade-fill-color", "#FF8E15");
                this.grade = "D";
            } else if (this.score >= 16.66) {
                this._box.style.setProperty("--grade-fill-color", "#FF4E11");
                this.grade = "E";
            } else {
                this._box.style.setProperty("--grade-fill-color", "#FF0D0D");
                this.grade = "F";
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
            <div class="box">
                <div class="text">${this.grade}</div>
            </div>
        `;
    }
}

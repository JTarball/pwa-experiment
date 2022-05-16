// Inspired by https://codepen.io/goodbits/pen/JjXomPJ

import { LitElement, html, css } from "lit";
import { customElement, query, property } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";

/*

 Financial metric slider, showing the current value between a min / max 

 e.g. Compare metric to its historical high / low
*/
@customElement("metric-slider")
export class MetricSlider extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Number })
    value: number = 0;

    @property({ type: Number })
    min: number = 0;

    @property({ type: Number })
    median?: number;

    @property({ type: Number })
    max: number = 100;

    @property({ type: Number })
    step: number = 1;

    @query("#slider-container")
    _track?: Element;

    @query("#slider")
    _slider?: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            .wrapper-wrap {
                position: block
                width: 100px;
                height: 50px;
            }

            .wrapper {
                position: absolute;
                /* width: 100px;
                height: 50px; */
                /* top: 0;
                left: 0; */
                display: flex;
                align-items: center;
                justify-content: center;
                /* background-color: #043643; */
                flex-direction: column;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            }

            #slider-container {
                --value: 0;
                --slider-track-color: #b0efef45;
                --slider-thumb-color: #fff;
                --slider-fill-color: #31d3c6;
                width: 100%;
                height: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
            }

            #slider {
                -webkit-appearance: none;
                appearance: none;

                height: 1rem;
                width: 100%;
                margin: 0;
                padding: 0;

                background-color: #00000000;
                outline: none;
                z-index: 99;
            }

            #slider-track {
                position: absolute;
                top: calc(50% - 0.25rem);
                left: 0;
                width: 100%;
                height: 0.5rem;
                border-radius: 0.25rem;
                background-color: var(--slider-track-color);
                overflow: hidden;
            }

            #slider-track::before {
                position: absolute;
                content: "";
                left: calc(-100% + 1.5rem);
                top: 0;
                width: calc(100% - 1rem);
                height: 100%;
                background-color: var(--slider-fill-color);
                transition: background-color 300ms ease-out;
                transform-origin: 100% 0%;
                transform: translateX(calc(var(--value) * 100%)) scaleX(1.2);
            }

            #slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                background-color: var(--slider-thumb-color);
                z-index: 99;
                border: 2px solid var(--slider-fill-color);
                transition: border-color 300ms ease-out;
            }

            #pre {
                z-index: 1;
                position: relative;
                right: 0.8rem;
            }

            #post {
                z-index: 1;
                position: relative;
                left: calc(100px + 2.6rem);
            }
        `,
    ];

    // -- Lifecycle function -- //

    update(changedProperties: PropertyValues) {
        if (this._slider && this._track) {
            let valuePercentage = this._slider.value / (this.max - this.min);
            this._track.style.setProperty("--value", valuePercentage);
            this.updateTrackerBG();
        }
        super.update(changedProperties);
    }

    firstUpdated() {
        if (this._slider && this._track) {
            let valuePercentage = this._slider.value / (this.max - this.min);
            this._track.style.setProperty("--value", valuePercentage);
            this.updateTrackerBG();
        }
    }

    // -- Other functions -- //
    updateTrackerBG() {
        let valuePercentage = this._slider.value / (this.max - this.min);

        if (valuePercentage >= 0.8) {
            this._track.style.setProperty("--slider-fill-color", "#69B34C");
        } else if (valuePercentage >= 0.6) {
            this._track.style.setProperty("--slider-fill-color", "#ACB334");
        } else if (valuePercentage >= 0.5) {
            this._track.style.setProperty("--slider-fill-color", "#FAB733");
        } else if (valuePercentage >= 0.4) {
            this._track.style.setProperty("--slider-fill-color", "#FF8E15");
        } else if (valuePercentage >= 0.2) {
            this._track.style.setProperty("--slider-fill-color", "#FF4E11");
        } else if (valuePercentage >= 0.1) {
            this._track.style.setProperty("--slider-fill-color", "#FF0D0D");
        }
    }

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        return html`
            <div class="wrapper-wrap">
                <div class="wrapper">
                    <div id="slider-container" style="--value:0.76;">
                        <label id="pre">${this.min}</label>
                        <input type="range" id="slider" min="${this.min}" max="${this.max}" step="${this.step}" value="${this.value}" disabled />
                        <div id="slider-track"></div>
                    </div>
                </div>
                <label id="post">${this.max}</label>
            </div>
        `;
    }
}

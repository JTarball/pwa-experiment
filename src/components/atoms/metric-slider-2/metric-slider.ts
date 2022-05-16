// Inspired by https://codepen.io/goodbits/pen/JjXomPJ

import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

/*

 Financial metric slider, showing the current value between a min / max 

 e.g. Compare metric to its historical high / low
*/
@customElement("metric-slider-2")
export class MetricSlider2 extends LitElement {
    // -- Start of state, properties, queries -- //

    // @property({ type: Boolean, reflect: false })
    // open: boolean = false;

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
    _track: Element;

    @query("#slider")
    _slider: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        // badge,
        // utility,
        // spacing,
        // themeStyles,
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
                cursor: pointer;
                z-index: 99;
                border: 2px solid var(--slider-fill-color);
                transition: border-color 300ms ease-out;
            }

            #value {
                position: absolute;
                bottom: calc(100% + 0.5rem);
                left: calc(var(--value) * calc(100% - 1rem) - 0.8rem);
                min-width: 3ch;
                border-radius: 4px;
                pointer-events: none;

                padding: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;

                color: black;
                background-color: #fff;
                opacity: 0;

                transition: left 300ms ease-out, opacity 300ms 300ms ease-out, background-color 300ms ease-out;

         
                z-index: 100;
                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                display: flex;
                flex-direction: column;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0.07);
                box-shadow: rgb(0 0 0 / 6%) 0px 8px 14px, rgb(0 0 0 / 4%) 0px 12px 16px;



            }

            #value::before {
                position: absolute;
                content: "";
                top: 100%;
                left: 50%;
                width: 1rem;
                height: 1rem;
                border-radius: 2px;
                background-color: inherit;
                transform: translate(-50%, -80%) rotate(45deg);
                z-index: -1;
            }

            #slider-container:hover #value {
                opacity: 1;
            }

            #pre {
                z-index: 1;
                position: relative;
                right: 0.8rem;
            }

            #post {
                z-index: 1;
                position: relative;
                left: 1.4rem;
            }
        `,
    ];

    // -- Lifecycle function -- //

    update(changedProperties: PropertyValues) {
        if (this._slider && this._track) {
            console.log("lemon slider");
            let valuePercentage = this._slider.value / (this.max - this.min);
            //value.innerText = slider.value ;
            this._track.style.setProperty("--value", valuePercentage);
            this.updateTrackerBG();
        }
        super.update(changedProperties);
    }

    firstUpdated() {
        if (this._slider && this._track) {
            console.log("lemon slider");
            let valuePercentage = this._slider.value / (this.max - this.min);
            //value.innerText = slider.value ;
            this._track.style.setProperty("--value", valuePercentage);
            this.updateTrackerBG();
        }
    }

    // -- Other functions -- //
    updateTrackerBG() {
        let valuePercentage = this._slider.value / (this.max - this.min);

        console.log("updateTrackerBG", valuePercentage, this._slider.value, this.max, this.min);

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
                        <span id="pre">${this.min}</span>
                        <input type="range" id="slider" min="${this.min}" max="${this.max}" step="${this.step}" value="${this.value}" disabled />
                        <span id="post">${this.max}</span>
                        <!-- <div id="value">
                            <vaadin-vertical-layout>
                                <span>${this.value}</span>
                                <span>low: ${this.min} high: ${this.max} ${this.median ? "median:" : ""}${this.median}</span>
                            </vaadin-vertical-layout>
                        </div> -->
                        <div id="slider-track"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

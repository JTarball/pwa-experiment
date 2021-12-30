/* 
    Tab Item - Used by yld0-tabs

    A styling webcomponent really should not be used
    on its own unless you know what you are doing 

*/
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { live } from "lit-html/directives/live";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-area";
import { FormLayoutResponsiveStep } from "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { UserStock } from "../store/models.js";

@customElement("addalert-form")
class AddAlertForm extends LitElement {
    /* Properties, states, mixins etc. */
    @property()
    private stock?: UserStock;

    @state()
    private difference: Number = 0;

    @state()
    private target: Number;

    @property()
    private targetLabel: String = "Target Price";

    /* End of properties, states ... */
    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            textarea {
                resize: none;
            }
            label {
                color: var(--lumo-secondary-text-color);
                display: inline;
                cursor: default;
                font-size: 0.8em;
                font-weight: normal;
                pointer-events: none;
            }
            input,
            textarea {
                background-color: white;
                background: white;
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-s);
                padding: 0px;
                margin: 0px;
                display: block;
                border: white;
                border-radius: 0;
                border-right-color: white;
                border-bottom: 1px solid var(--lumo-secondary-text-color);
                border-right-color: none;
            }

            input:focus {
                border: none;
                background-color: none;
                outline: none;
                border-bottom: 1px solid var(--lumo-primary-text-color);
            }

            /* active state */
            input:focus + .control-label {
                color: var(--lumo-primary-text-color);
            }
        `,
    ];

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        { minWidth: 0, columns: 1 },
        { minWidth: "10em", columns: 3 },
    ];

    updated(changedProperties: PropertyValues<this>) {
        super.updated(changedProperties);

        if (this.target == null && this.stock?.priceNumber != null) {
            this.target = this.stock?.priceNumber + this.stock?.priceNumber * 0.2;
        }
        this.difference = this.target - this.stock?.priceNumber;
    }

    private calcPercentDiff() {
        const percentDiff = ((this.difference / this.stock?.priceNumber) * 100).toFixed(2);
        const incOrDec = percentDiff >= 0 ? "increase" : "decrease";
        return percentDiff + "% " + incOrDec;
    }

    render() {
        return html`
            <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m); display: block; padding: var(--lumo-space-s);">
                <vaadin-horizontal-layout style="align-items: center; text-align: center;padding-left: 15%; padding-right: 15%;" theme="spacing">
                    <span><vaadin-avatar img="${this.stock?.logoUrl}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: var(--lumo-size-xl);"></vaadin-avatar></span>
                    <span class="description" style="width: 50px;"> The current price is ${this.stock?.price} </span>
                </vaadin-horizontal-layout>
                <p style="padding-right: 15%; padding-left: 15%" class="description">The following alert will be triggered when the price rises above ${this.target} (${this.calcPercentDiff()})</p>
            </vaadin-vertical-layout>

            <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                
                <input
                    name="target"
                    colspan="3"
                    @keyup=${(e) => {
                        console.log(e.srcElement.value);
                        this.difference = e.srcElement.value - this.stock?.priceNumber;
                        console.log(this.difference);
                        this.target = e.srcElement.value;
                    }}
                    value=${this.target}
                ></input><label class="control-label" for="target">${this.targetLabel}</label>
                <vaadin-text-area label="Notes" colspan="3"></vaadin-text-area>
            </vaadin-form-layout>
            <slot></slot>
        `;
    }
}

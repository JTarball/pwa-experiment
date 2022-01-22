/* 
    Tab Item - Used by yld0-tabs

    A styling webcomponent really should not be used
    on its own unless you know what you are doing 

*/
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-area";
import "@vaadin/button";
import "@vaadin/select";
import { FormLayoutResponsiveStep } from "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { UserStock } from "../../../store/models.js";

import "../../generic/number-input";
import "../../generic/text-area";
import { render1dPriceChange, render1yrPriceChange } from "../../generic/helpers.js";

@customElement("addalert-form")
class AddAlertForm extends LitElement {
    // -- Properties, states, controllers etc. -- //
    @property()
    stock: Object;

    @property()
    alertKey: string; // An indicator for what alert form should be displayed

    @state()
    startingVal: Float; // A starting value for number inputs;

    @property()
    description: string = "";

    @state()
    meta: string = ""; // meta information for input (used by multiple alert forms)

    @state()
    metaClass: string = ""; // styling class for meta

    @state()
    disableSubmit: boolean = false;

    // -- End of properties, states -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            vaadin-form-layout {
                padding: 10px;
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

            .formHeader {
                margin-bottom: 10px;
                padding: 16px;
                font-family: Inter, Noto, Arial, sans-serif;
            }

            .earningsDesc {
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
                padding: 16px;
                margin-left: auto;
                margin-right: auto;
            }

            /* vaadin-select-value-button {} */
            vaadin-input-container {
                background-color: red;
            }
        `,
    ];

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        { minWidth: 0, columns: 1 },
        { minWidth: "10em", columns: 1 },
    ];

    async firstUpdated() {
        switch (this.alertKey) {
            case "target_price_rises":
                this.startingVal = this.stock.price_number * 1.1;
                this.updateTargetAlertMeta(this.startingVal);
                this.updateTargetAlertDescription(this.startingVal, true);
                break;
            case "target_price_falls":
                this.startingVal = this.stock.price_number * 0.8;
                this.updateTargetAlertMeta(this.startingVal);
                this.updateTargetAlertDescription(this.startingVal, false);
                break;
            case "change_in_price_change":
                this.startingVal = (this.stock.price_number / 10).toFixed(2);
                this.updateChangePriceMeta(this.startingVal, 1);
                this.updateChangeInPriceAlertDescription(this.startingVal, 1);
                break;
            case "change_in_price_increase":
                this.startingVal = (this.stock.price_number / 10).toFixed(2);
                this.updateChangePriceMeta(this.startingVal, 2);
                this.updateChangeInPriceAlertDescription(this.startingVal, 2);
                break;
            case "change_in_price_decrease":
                this.startingVal = (this.stock.price_number / 10).toFixed(2);
                this.updateChangePriceMeta(this.startingVal, 3);
                this.updateChangeInPriceAlertDescription(this.startingVal, 3);
                break;
            case "change_in_percent_change":
                this.startingVal = 20;
                this.updateChangePercentMeta(this.startingVal, 1);
                this.updateChangeInPercentAlertDescription(this.startingVal, 1);
                break;
            case "change_in_percent_increase":
                this.startingVal = 20;
                this.updateChangePercentMeta(this.startingVal, 2);
                this.updateChangeInPercentAlertDescription(this.startingVal, 2);
                break;
            case "change_in_percent_decrease":
                this.startingVal = 20;
                this.updateChangePercentMeta(this.startingVal, 3);
                this.updateChangeInPercentAlertDescription(this.startingVal, 3);
                break;
            case "trailing_stop_price":
                this.startingVal = 0;
                this.updateTrailingStopPriceAlertMeta(this.startingVal);
                this.updateTrailingStopPriceAlertDescription(this.startingVal, true);
                break;
            case "trailing_stop_percent":
                this.startingVal = 0;
                this.updateTrailingStopPriceAlertMeta(this.startingVal);
                this.updateTrailingStopPriceAlertDescription(this.startingVal, false);
                break;
            case "trailing_high_price":
                this.startingVal = 0;
                this.updateTrailingBuyPriceAlertMeta(this.startingVal);
                this.updateTrailingBuyPriceAlertDescription(this.startingVal, true);
                break;
            case "trailing_high_percent":
                this.startingVal = 0;
                this.updateTrailingBuyPriceAlertMeta(this.startingVal);
                this.updateTrailingBuyPriceAlertDescription(this.startingVal, false);
                break;
        }
    }

    // -- Alert Specific Utility Functions -- //

    // Calculates the meta information for number inputs

    // Target

    private updateTargetAlertDescription(target: Float, rises: booleam) {
        let diff = target - this.stock.price_number;

        let diff_description = "";
        if (diff == 0) {
            diff_description = "";
        } else if (diff > 0) {
            diff_description = `(${this.stock.currency_symbol}${diff.toFixed(2)} increase)`;
        } else {
            diff_description = `(${this.stock.currency_symbol}${diff.toFixed(2)} decrease)`;
        }

        // No value for target, is a special case
        if (target == 0) {
            target = "X";
            diff_description = "";
        }

        this.description = `The following alert will be triggered when the price ${rises ? "rises above" : "falls below"} ${this.stock.currency_symbol}${target}. ${diff_description}`;
    }

    private updateTargetAlertMeta(priceVal: Float) {
        if (this.stock.price_number) {
            let diff = priceVal - this.stock.price_number;
            let diff_percent = ((diff / this.stock.price_number) * 100).toFixed(2);

            if (diff == 0) {
                this.meta = "";
                this.metaClass = "";
            } else if (diff > 0) {
                this.meta = `${diff.toFixed(3)} (${diff_percent}%) above the current price.`;
                this.metaClass = "meta-success";
            } else if (diff < 0) {
                this.meta = `${diff.toFixed(3)} (${diff_percent}%) below the current price.`;
                this.metaClass = "meta-error";
            }
        }
    }

    private handleTargetAlertChange(e: Event) {
        this.updateTargetAlertMeta(e.detail.value);
        this.updateTargetAlertDescription(e.detail.value);
        this.disableSubmit = e.detail.value ? false : true;
    }

    // Change in Price

    private updateChangeInPriceAlertDescription(target: string, change_type: int) {
        let info;
        switch (change_type) {
            case 1:
                info = "changes by";
                break;
            case 2:
                info = "increases by";
                break;
            case 3:
                info = "decreases by";
                break;
            default:
                info = "changes by";
                break;
        }

        this.description = `The following alert will be triggered when the price ${info} ${this.stock.currency_symbol}${target || "X"}.`;
    }

    private updateChangePriceMeta(priceVal: string, change_type: int) {
        if (!priceVal) {
            this.meta = "";
            return;
        }

        priceVal = parseFloat(priceVal);

        let price;
        switch (change_type) {
            case 1:
                const priceInc = (this.stock.price_number + priceVal).toFixed(2);
                const priceDec = (this.stock.price_number - priceVal).toFixed(2);
                price = `${this.stock.currency_symbol}${priceInc} or ${this.stock.currency_symbol}${priceDec}`;
                break;
            case 2:
                price = Number(this.stock.price_number + priceVal).toFixed(2);
                price = `${this.stock.currency_symbol}${price}`;
                break;
            case 3:
                price = Number(this.stock.price_number - priceVal).toFixed(2);
                price = `${this.stock.currency_symbol}${price}`;
                break;
            default:
                break;
        }

        if (this.stock.price_number) {
            this.meta = `The price would be ${price}`;
            this.metaClass = "";
        }
    }

    private handleChangeInPriceChange(e: Event) {
        let change_type = 1;
        switch (this.alertKey) {
            case "change_in_price_change":
                change_type = 1;
                break;
            case "change_in_price_increase":
                change_type = 2;
                break;
            case "change_in_price_decrease":
                change_type = 3;
                break;

            default:
                change_type = 1;
        }

        this.updateChangePriceMeta(e.detail.value, change_type);
        this.updateChangeInPriceAlertDescription(e.detail.value, change_type);
        this.disableSubmit = e.detail.value ? false : true;
    }

    // Change in Percent

    private updateChangeInPercentAlertDescription(target: string, change_type: int) {
        let info;
        switch (change_type) {
            case 1:
                info = "changes by";
                break;
            case 2:
                info = "increases by";
                break;
            case 3:
                info = "decreases by";
                break;
            default:
                info = "changes by";
                break;
        }

        this.description = `The following alert will be triggered when the percent ${info} ${target || "X"}%.`;
    }

    private updateChangePercentMeta(priceVal: string, change_type: int) {
        if (!priceVal) {
            this.meta = "";
            return;
        }

        priceVal = parseFloat(priceVal);

        let price;
        switch (change_type) {
            case 1:
                const priceInc = Number(this.stock.price_number + (priceVal / 100) * this.stock.price_number).toFixed(2);
                const priceDec = Number(this.stock.price_number - (priceVal / 100) * this.stock.price_number).toFixed(2);
                price = `${this.stock.currency_symbol}${priceInc} or ${this.stock.currency_symbol}${priceDec}`;
                break;
            case 2:
                price = Number(this.stock.price_number + (priceVal / 100) * this.stock.price_number).toFixed(2);
                price = `${this.stock.currency_symbol}${price}`;
                break;
            case 3:
                price = Number(this.stock.price_number - (priceVal / 100) * this.stock.price_number).toFixed(2);
                price = `${this.stock.currency_symbol}${price}`;
                break;
            default:
                break;
        }

        if (this.stock.price_number) {
            this.meta = `The price would be ${price}`;
            this.metaClass = "";
        }
    }

    private handleChangeInPercentChange(e: Event) {
        let change_type = 1;
        switch (this.alertKey) {
            case "change_in_percent_change":
                change_type = 1;
                break;
            case "change_in_percent_increase":
                change_type = 2;
                break;
            case "change_in_percent_decrease":
                change_type = 3;
                break;

            default:
                change_type = 1;
        }

        this.updateChangePercentMeta(e.detail.value, change_type);
        this.updateChangeInPercentAlertDescription(e.detail.value, change_type);
        this.disableSubmit = e.detail.value ? false : true;
    }

    // Trailing Stop

    private updateTrailingStopPriceAlertDescription(target: string, is_price_diff: bool) {
        let info;
        if (is_price_diff) {
            info = `price decreases by ${this.stock.currency_symbol}${target || "X"}`;
        } else {
            info = `percent decreases by ${target || "X"}%`;
        }

        this.description = `The following alert will be triggered when the ${info} delta to the current market price. The alert trails the market recalculating based of the new market price. This is type of alert is often used to lock in market gains in traditional trade orders.`;
    }

    private updateTrailingStopPriceAlertMeta(priceVal: string) {
        this.meta = "";
    }

    private handleTrailingStopPriceAlertChange(e: Event) {
        let is_price_diff;
        switch (this.alertKey) {
            case "trailing_stop_price":
                is_price_diff = true;
                break;
            case "trailing_stop_percent":
                is_price_diff = false;
                break;
            default:
                is_price_diff = true;
        }

        this.updateTrailingStopPriceAlertMeta(e.detail.value);
        this.updateTrailingStopPriceAlertDescription(e.detail.value, is_price_diff);
        this.disableSubmit = e.detail.value ? false : true;
    }

    // Trailing Buy Stop

    private updateTrailingBuyPriceAlertDescription(target: string, is_price_diff: bool) {
        let info;
        if (is_price_diff) {
            info = `price increases by ${this.stock.currency_symbol}${target || "X"}`;
        } else {
            info = `percent increases by ${target || "X"}%`;
        }

        this.description = `The following alert will be triggered when the ${info} delta to the current market price. The alert trails the market recalculating based of the new market price. This is type of alert is often used to lock in market buy in traditional trade orders.`;
    }

    private updateTrailingBuyPriceAlertMeta(priceVal: string) {
        this.meta = "";
    }

    private handleTrailingBuyPriceAlertChange(e: Event) {
        let is_price_diff;
        switch (this.alertKey) {
            case "trailing_high_price":
                is_price_diff = true;
                break;
            case "trailing_high_percent":
                is_price_diff = false;
                break;
            default:
                is_price_diff = true;
        }

        this.updateTrailingBuyPriceAlertMeta(e.detail.value);
        this.updateTrailingBuyPriceAlertDescription(e.detail.value, is_price_diff);
        this.disableSubmit = e.detail.value ? false : true;
    }

    // Earning

    // -- End of alert specific utility functions -- //

    private renderForm() {
        switch (this.alertKey) {
            case "target_price_rises":
                return html`
                    <h2 class="formHeader">Rise Target Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleTargetAlertChange}
                            label="Target Price"
                            placeholder="Enter Target Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "target_price_falls":
                return html`
                    <h2 class="formHeader">Fall Target Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleTargetAlertChange}
                            label="Target Price"
                            placeholder="Enter Target Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_price_change":
                return html`
                    <h2 class="formHeader">Change in Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleChangeInPriceChange}
                            label="Change Price"
                            placeholder="Enter Change in Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_price_increase":
                return html`
                    <h2 class="formHeader">Change in Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleChangeInPriceChange}
                            label="Change Price"
                            placeholder="Enter Change in Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_price_decrease":
                return html`
                    <h2 class="formHeader">Change in Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleChangeInPriceChange}
                            label="Change Price"
                            placeholder="Enter Change in Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_percent_change":
                return html`
                    <h2 class="formHeader">Change in Percent Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleChangeInPercentChange}
                            label="Change Percent"
                            placeholder="Enter Change in Percent"
                            suffix="%"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_percent_increase":
                return html`
                    <h2 class="formHeader">Change in Percent Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleChangeInPercentChange}
                            label="Change Percent"
                            placeholder="Enter Change in Percent"
                            suffix="%"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_percent_decrease":
                return html`
                    <h2 class="formHeader">Change in Percent Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleChangeInPercentChange}
                            label="Change Percent"
                            placeholder="Enter Change in Percent"
                            suffix="%"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_stop_price":
                return html`
                    <h2 class="formHeader">Price Trailing Stop Loss Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleTrailingStopPriceAlertChange}
                            label="Trailing Price Change"
                            placeholder=""
                            prefix="${this.stock.currency_symbol}"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_stop_percent":
                return html`
                    <h2 class="formHeader">Percent Trailing Stop Loss Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleTrailingStopPriceAlertChange}
                            label="Trailing Percent Change"
                            placeholder=""
                            suffix="%"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_high_price":
                return html`
                    <h2 class="formHeader">Price Trailing Buy Stop Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleTrailingBuyPriceAlertChange}
                            label="Trailing Price Change"
                            placeholder=""
                            prefix="${this.stock.currency_symbol}"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_high_percent":
                return html`
                    <h2 class="formHeader">Percent Trailing Stop Loss Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <number-input
                            @on-change=${this.handleTrailingBuyPriceAlertChange}
                            label="Trailing Percent Change"
                            placeholder=""
                            suffix="%"
                            value=${this.startingVal}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area label="Notes"></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "earnings_one_day":
                return html`
                    <h2 class="formHeader">Percent Trailing Stop Loss Alert</h2>
                    <h4 class="earningsDesc" style="width: 100%">One day before earnings call</h4>
                    <vaadin-select id="select"></vaadin-select>
                `;
                break;
        }
    }

    render() {
        return html`
            <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m); display: block; padding: var(--lumo-space-xs);">
                <vaadin-horizontal-layout style="align-items: center; text-align: center;padding-left: 15%; padding-right: 15%;" theme="spacing">
                    <span><vaadin-avatar img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: var(--lumo-size-xl);"></vaadin-avatar></span>
                    <span class="description" style="width: 150px;"> ${this.stock.company_name} current price is ${this.stock?.price} </span>
                    <vaadin-vertical-layout>
                        <span class="description" style="width: 150px;">${render1dPriceChange(this.stock)} </span>
                        <span class="description" style="width: 150px;">${render1yrPriceChange(this.stock)} </span>
                    </vaadin-vertical-layout>
                </vaadin-horizontal-layout>
                <p style="padding-right: 5%; padding-left: 5%; font-size: var(--lumo-size-xxs);" class="description">${this.description}</p>
            </vaadin-vertical-layout>

            ${this.renderForm()}

            <div style="padding-right: 10em;">
                <vaadin-button theme="primary contrast" style="float: right;" ?disabled=${this.disableSubmit}>Save Alert</vaadin-button>
            </div>
        `;
    }
}

// Target Price  - price + notes + save
// Change in price - value + notes + save
// Change in percent - value + notes + save
// trailing - same
// trailing - same
// earnings   - save
// time review - save

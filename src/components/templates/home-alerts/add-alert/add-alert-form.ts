/* 
    Tab Item - Used by yld0-tabs

    A styling webcomponent really should not be used
    on its own unless you know what you are doing 

*/
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";
import { formatDistance, addDays, addMonths, addYears } from "date-fns";

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

import { themeStyles } from "../../../../themes/yld0-theme/styles.js";
import { UserStock } from "../../../../store/models.js";

import { AddTargetPriceAlert } from "./AddTargetPriceAlert.query.graphql.js";
import { AddChangeInPriceAlert } from "./AddChangeInPriceAlert.query.graphql.js";
import { AddChangeInPercentAlert } from "./AddChangeInPercentAlert.query.graphql.js";
import { AddEarningsAlert } from "./AddEarningsAlert.query.graphql.js";
import { AddTimingReviewAlert } from "./AddTimingReviewAlert.query.graphql.js";
import { AddTrailingHighAlert } from "./AddTrailingHighAlert.query.graphql.js";
import { AddTrailingStopAlert } from "./AddTrailingStopAlert.query.graphql.js";
import { GetAlertFollows } from "../GetAlertFollows.query.graphql.js";

import "../../../atoms/notification/notification";
import "../../../atoms/number-input/number-input";
import "../../../atoms/text-area/text-area";
import "../../../atoms/toggle-group/toggle-group";
import "../../../atoms/help/help";
import { render1dPriceChange, render1yrPriceChange } from "../../../_generic/helpers.js";
import { urlForName } from "../../../../router/index.js";

@customElement("addalert-form")
class AddAlertForm extends LitElement {
    // -- Properties, states, controllers etc. -- //

    toggle_group_type = [
        { id: "ONE_OFF", label: "One-off", selected: true }, // if you change this remember to adjust this.repeated
        { id: "REPEATED", label: "Repeated", selected: false },
    ];

    toggle_group_notification_types = [
        { id: "EMAIL_NOTIFICATION", label: "Email", selected: true },
        { id: "PUSH_NOTIFICATION", label: "Push", selected: false },
    ];

    @property()
    stock: Object;

    @property()
    alertKey: string; // An indicator for what alert form should be displayed

    @state()
    startingVal: Float; // A starting value for number inputs;

    // Generic container variables used by many of the alerts

    @state()
    repeated: Boolean = false;

    @state()
    value: Float; // The value for number inputs;

    @state()
    notes: String = "";

    @state()
    notification_types: [String] = [];

    // ---- Generic Notification

    @state()
    notificationOpened = false;

    @state()
    notificationText: String = "";

    // ----

    @property()
    description: string = "";

    @state()
    meta: string = ""; // meta information for input (used by multiple alert forms)

    @state()
    metaClass: string = ""; // styling class for meta

    @state()
    disableSubmit: boolean = false;

    mutation_add_target_price = new ApolloMutationController(this, AddTargetPriceAlert);
    mutation_add_change_in_price = new ApolloMutationController(this, AddChangeInPriceAlert);
    mutation_add_change_in_percent = new ApolloMutationController(this, AddChangeInPercentAlert);
    mutation_add_trailing_stop = new ApolloMutationController(this, AddTrailingStopAlert);
    mutation_add_trailing_high = new ApolloMutationController(this, AddTrailingHighAlert);
    mutation_add_earnings = new ApolloMutationController(this, AddEarningsAlert);
    mutation_add_time_review = new ApolloMutationController(this, AddTimingReviewAlert);

    query = new ApolloQueryController(this, GetAlertFollows, {
        noAutoSubscribe: true,
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
    });

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

            select {
                font-family: inherit;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.15px;
                line-height: 20px;
                -webkit-box-align: center;
                align-items: center;
                background-color: white;
                border-color: rgb(172, 181, 185);
                border-radius: 4px;
                border-style: solid;
                border-width: 1px;
                color: rgb(35, 39, 41);
                cursor: pointer;
                display: inline-flex;
                height: 36px;
                min-height: 36px;
                outline: none;
                padding: 0px 12px;
                position: relative;
                white-space: nowrap;
                width: 100%;
            }

            option {
                font-family: inherit;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.15px;
                line-height: 20px;
                cursor: pointer;
                list-style-type: none;
                padding: 4px 16px;
                color: rgb(35, 39, 41);
                background-color: rgb(244, 245, 246);
            }

            number-input {
                margin-top: 3em;
            }

            select {
                margin-top: 3em;
            }

            .label {
                align-self: flex-start;
                color: var(--lumo-secondary-text-color);
                font-weight: 500;
                font-size: var(--lumo-font-size-micro);
                margin-left: calc(var(--lumo-border-radius-m) / 4);
                transition: color 0.2s;
                line-height: 1;
                padding-right: 1em;
                padding-bottom: 0.5em;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                position: relative;
                max-width: 100%;
                box-sizing: border-box;
                top: -60px;
            }
        `,
    ];

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        { minWidth: 0, columns: 1 },
        { minWidth: "10em", columns: 1 },
    ];

    async firstUpdated() {
        let startingNotifications: [String] = [];
        Array.from(this.toggle_group_notification_types).forEach((item, i) => {
            if (item.selected) {
                startingNotifications.push(item.id);
            }
        });

        switch (this.alertKey) {
            case "target_price_rises":
                const startingVal = (this.stock.price_number * 1.1).toFixed(2);

                this.updateTargetAlertMeta(startingVal);
                this.updateTargetAlertDescription(startingVal, true);
                this.value = startingVal;
                this.notification_types = startingNotifications;
                break;
            case "target_price_falls":
                const startingValFalls = (this.stock.price_number * 0.8).toFixed(2);
                let startingNotificationsFalls: [String] = [];
                Array.from(this.toggle_group_notification_types).forEach((item, i) => {
                    if (item.selected) {
                        startingNotificationsFalls.push(item.id);
                    }
                });

                this.updateTargetAlertMeta(startingValFalls);
                this.updateTargetAlertDescription(startingValFalls, true);
                this.value = startingValFalls;
                this.notification_types = startingNotificationsFalls;

                break;
            case "change_in_price_change":
                const startingValPriceChange = (this.stock.price_number / 10).toFixed(2);
                this.updateChangePriceMeta(startingValPriceChange, 1);
                this.updateChangeInPriceAlertDescription(startingValPriceChange, 1);
                this.value = startingValPriceChange;
                this.notification_types = startingNotifications;

                break;
            case "change_in_price_increase":
                const startingValChangeInPriceIncrease = (this.stock.price_number / 10).toFixed(2);
                this.updateChangePriceMeta(startingValChangeInPriceIncrease, 2);
                this.updateChangeInPriceAlertDescription(startingValChangeInPriceIncrease, 2);
                this.value = startingValChangeInPriceIncrease;
                this.notification_types = startingNotifications;
                break;
            case "change_in_price_decrease":
                const startingValChangeInPriceDecrease = (this.stock.price_number / 10).toFixed(2);
                this.updateChangePriceMeta(startingValChangeInPriceDecrease, 3);
                this.updateChangeInPriceAlertDescription(startingValChangeInPriceDecrease, 3);
                this.value = startingValChangeInPriceDecrease;
                this.notification_types = startingNotifications;
                break;
            case "change_in_percent_change":
                const startingValChangeInPercentChange = "20";
                this.updateChangePercentMeta(startingValChangeInPercentChange, 1);
                this.updateChangeInPercentAlertDescription(startingValChangeInPercentChange, 1);
                this.value = parseFloat(startingValChangeInPercentChange);
                this.notification_types = startingNotifications;
                break;
            case "change_in_percent_increase":
                const startingValChangeInPercentIncrease = "20";
                this.updateChangePercentMeta(startingValChangeInPercentIncrease, 2);
                this.updateChangeInPercentAlertDescription(startingValChangeInPercentIncrease, 2);
                this.value = parseFloat(startingValChangeInPercentIncrease);
                this.notification_types = startingNotifications;
                break;
            case "change_in_percent_decrease":
                const startingValChangeInPercentDecrease = "20";
                this.updateChangePercentMeta(startingValChangeInPercentDecrease, 3);
                this.updateChangeInPercentAlertDescription(startingValChangeInPercentDecrease, 3);
                this.value = parseFloat(startingValChangeInPercentDecrease);
                this.notification_types = startingNotifications;
                break;
            case "trailing_stop_price":
                const startingValTrailingStop = "0";
                this.updateTrailingStopPriceAlertMeta(startingValTrailingStop, true);
                this.updateTrailingStopPriceAlertDescription(startingValTrailingStop, true);
                this.value = parseFloat(startingValTrailingStop);
                this.notification_types = startingNotifications;
                break;
            case "trailing_stop_percent":
                const startingValTrailingPercentStop = "20";
                this.updateTrailingStopPriceAlertMeta(startingValTrailingPercentStop, false);
                this.updateTrailingStopPriceAlertDescription(startingValTrailingPercentStop, false);
                this.value = parseFloat(startingValTrailingPercentStop);
                this.notification_types = startingNotifications;
                break;
            case "trailing_high_price":
                const startingValTrailingHighPrice = "0";
                this.updateTrailingBuyPriceAlertMeta(startingValTrailingHighPrice, true);
                this.updateTrailingBuyPriceAlertDescription(startingValTrailingHighPrice, true);
                this.value = parseFloat(startingValTrailingHighPrice);
                this.notification_types = startingNotifications;
                break;
            case "trailing_high_percent":
                const startingValTrailingHighPercent = "20";
                this.updateTrailingBuyPriceAlertMeta(startingValTrailingHighPercent, false);
                this.updateTrailingBuyPriceAlertDescription(startingValTrailingHighPercent, false);
                this.value = parseFloat(startingValTrailingHighPercent);
                this.notification_types = startingNotifications;
                break;
            case "earnings_one_day":
                this.notification_types = startingNotifications;
                this.updateEarningsAlertDescription("oneday");
                this.updateEarningsTriggerVal("oneday");
                break;
            case "earnings_three_days":
                this.notification_types = startingNotifications;
                this.updateEarningsAlertDescription("threedays");
                this.updateEarningsTriggerVal("threedays");
                break;
            case "earnings_one_week":
                this.notification_types = startingNotifications;
                this.updateEarningsAlertDescription("oneweek");
                this.updateEarningsTriggerVal("oneweek");
                break;
            case "earnings_one_month":
                this.notification_types = startingNotifications;
                this.updateEarningsAlertDescription("onemonth");
                this.updateEarningsTriggerVal("onemonth");
                break;
            case "time_review_one_month":
                this.notification_types = startingNotifications;
                this.updateTimeReviewAlertDescription("onemonth");
                this.updateTimeReviewTriggerVal("onemonth");
                break;
            case "time_review_three_months":
                this.notification_types = startingNotifications;
                this.updateTimeReviewAlertDescription("threemonths");
                this.updateTimeReviewTriggerVal("threemonths");
                break;
            case "time_review_six_months":
                this.notification_types = startingNotifications;
                this.updateTimeReviewAlertDescription("sixmonths");
                this.updateTimeReviewTriggerVal("sixmonths");
                break;
            case "time_review_one_year":
                this.notification_types = startingNotifications;
                this.updateTimeReviewAlertDescription("oneyear");
                this.updateTimeReviewTriggerVal("oneyear");
                break;
            case "time_review_five_years":
                this.notification_types = startingNotifications;
                this.updateTimeReviewAlertDescription("fiveyears");
                this.updateTimeReviewTriggerVal("fiveyears");
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
            diff_description = `(${this.stock.currency_symbol}${diff.toFixed(2)} increase from ${this.stock.price})`;
        } else {
            diff_description = `(${this.stock.currency_symbol}${Math.abs(diff).toFixed(2)} decrease from ${this.stock.price})`;
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
        let rises = true;
        switch (this.alertKey) {
            case "target_price_rises":
                rises = true;
                break;
            case "target_price_falls":
                rises = false;
                break;
        }

        this.updateTargetAlertMeta(e.detail.value);
        this.updateTargetAlertDescription(e.detail.value, rises);
        this.value = e.detail.value;
        this.validate();
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
        this.value = e.detail.value;
        this.validate();
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
        this.validate();
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

    private updateTrailingStopPriceAlertMeta(priceVal: string, is_price_diff: boolean) {
        if (!priceVal) {
            this.meta = "";
            return;
        }

        priceVal = parseFloat(priceVal);

        if (is_price_diff) {
            let diff = this.stock.price_number - priceVal;
            let diff_percent = ((priceVal / this.stock.price_number) * 100).toFixed(2);

            if (priceVal == 0) {
                this.meta = "";
                this.metaClass = "";
            } else {
                this.meta = `Price will initially be triggered at ${diff.toFixed(3)} before trailing. This is (${diff_percent}%) below the current price.`;
                this.metaClass = "";
            }
        } else {
            let price = Number(this.stock.price_number - (priceVal / 100) * this.stock.price_number).toFixed(2);
            price = `${this.stock.currency_symbol}${price}`;

            if (this.stock.price_number) {
                this.meta = `Price will initially be triggered @ ${price}`;
                this.metaClass = "";
            }
        }
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

        this.updateTrailingStopPriceAlertMeta(e.detail.value, is_price_diff);
        this.updateTrailingStopPriceAlertDescription(e.detail.value, is_price_diff);
        this.value = e.detail.value;
        this.validate();
    }

    // Trailing Buy Stop

    private updateTrailingBuyPriceAlertDescription(target: string, is_price_diff: boolean) {
        let info;
        if (is_price_diff) {
            info = `price increases by ${this.stock.currency_symbol}${target || "X"}`;
        } else {
            info = `percent increases by ${target || "X"}%`;
        }

        this.description = `The following alert will be triggered when the ${info} delta to the current market price. The alert trails the market recalculating based of the new market price. This is type of alert is often used to lock in market buy in traditional trade orders.`;
    }

    private updateTrailingBuyPriceAlertMeta(priceVal: string, is_price_diff: boolean) {
        if (!priceVal) {
            this.meta = "";
            return;
        }

        priceVal = parseFloat(priceVal);

        if (is_price_diff) {
            let diff = this.stock.price_number + priceVal;
            let diff_percent = ((priceVal / this.stock.price_number) * 100).toFixed(2);

            if (priceVal == 0) {
                this.meta = "";
                this.metaClass = "";
            } else {
                this.meta = `Price will initially be triggered at ${diff.toFixed(3)} before trailing. This is (${diff_percent}%) above the current price.`;
                this.metaClass = "";
            }
        } else {
            let price = Number(this.stock.price_number - (priceVal / 100) * this.stock.price_number).toFixed(2);
            price = `${this.stock.currency_symbol}${price}`;

            if (this.stock.price_number) {
                this.meta = `Price will initially be triggered @ ${price}`;
                this.metaClass = "";
            }
        }
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

        this.updateTrailingBuyPriceAlertMeta(e.detail.value, is_price_diff);
        this.updateTrailingBuyPriceAlertDescription(e.detail.value, is_price_diff);
        this.value = e.detail.value;
        this.validate();
    }

    // Earning

    private updateEarningsAlertDescription(selectVal: string) {
        let info = "";
        switch (selectVal) {
            case "oneday":
                info = "one day";
                break;
            case "threedays":
                info = "three days";
                break;
            case "oneweek":
                info = "one week";
                break;
            case "onemonth":
                info = "one month";
                break;
        }

        if (info) {
            this.description = `The following alert will be triggered ${info} before the earnings. This type of alert is great for any decision making you might want to take before an earnings call.`;
        }
    }

    private handleEarningsAlertChange(e: Event) {
        this.updateEarningsAlertDescription(e.target.value);
        this.updateEarningsTriggerVal(e.target.value);
    }

    private updateEarningsTriggerVal(selectVal: string) {
        switch (selectVal) {
            case "oneday":
                this.value = "ONE_DAY_BEFORE";
                break;
            case "threedays":
                this.value = "THREE_DAYS_BEFORE";
                break;
            case "oneweek":
                this.value = "ONE_WEEK_BEFORE";
                break;
            case "onemonth":
                this.value = "ONE_MONTH_BEFORE";
                break;
        }
    }

    // -- Time Review -- //

    private updateTimeReviewAlertDescription(selectVal: string) {
        let info = "";
        let review_at;
        switch (selectVal) {
            case "onemonth":
                info = "one month";
                review_at = addDays(new Date(), 7);
                break;
            case "threemonths":
                info = "three months";
                review_at = addMonths(new Date(), 3);
                break;
            case "sixmonths":
                info = "six months";
                review_at = addMonths(new Date(), 6);
                break;
            case "oneyear":
                info = "one year";
                review_at = addYears(new Date(), 1);
                break;
            case "fiveyears":
                info = "five years";
                review_at = addYears(new Date(), 5);
                break;
        }

        if (info) {
            this.description = `The following alert will be triggered in ${info} - ${review_at}. Note: We strongly recommend using notes with these alerts to inform what action to take when the alert is finally triggered.`;
        }
    }

    private handleTimeReviewAlertChange(e: Event) {
        this.updateTimeReviewAlertDescription(e.target.value);
        this.updateTimeReviewTriggerVal(e.target.value);
    }

    private updateTimeReviewTriggerVal(selectVal: string) {
        switch (selectVal) {
            case "onemonth":
                this.value = "REVIEW_ONE_MONTH";
                break;
            case "threemonths":
                this.value = "REVIEW_THREE_MONTH";
                break;
            case "sixmonths":
                this.value = "REVIEW_SIX_MONTH";
                break;
            case "oneyear":
                this.value = "REVIEW_ONE_YEAR";
                break;
            case "fiveyears":
                this.value = "REVIEW_FIVE_YEAR";
                break;
        }
    }

    // -- End of alert specific utility functions -- //

    // -- Validation -- //
    private validate() {
        switch (this.alertKey) {
            case "target_price_rises":
            case "target_price_falls":
            case "change_in_price_change":
            case "change_in_price_increase":
            case "change_in_price_decrease":
            case "change_in_percent_change":
            case "change_in_percent_increase":
            case "change_in_percent_decrease":
            case "trailing_stop_price":
            case "trailing_stop_percent":
            case "trailing_high_price":
            case "trailing_high_percent":
                this.disableSubmit = this.value && this.notification_types.length > 0 ? false : true;
                break;
            case "earnings_one_day":
            case "earnings_three_days":
            case "earnings_one_week":
            case "earnings_one_month":
                this.disableSubmit = this.notification_types.length > 0 ? false : true;
                break;
            case "time_review_one_month":
            case "time_review_three_months":
            case "time_review_six_months":
            case "time_review_one_year":
            case "time_review_five_years":
                this.disableSubmit = this.notification_types.length > 0 ? false : true;
                break;
        }
    }

    // --- Save --- //
    private async handleAddAlert(e: Event) {
        var data;
        var error: boolean = `Failed to save alert for ${this.stock.symbol}`;
        var loading: boolean = false;

        switch (this.alertKey) {
            case "target_price_rises":
                console.debug("target_price_rises");

                var { data, error, loading } = await this.mutation_add_target_price.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: false,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "TARGET_RISES", target: parseFloat(this.value) },
                    },
                });

                break;
            case "target_price_falls":
                console.debug("target_price_rises");

                var { data, error, loading } = await this.mutation_add_target_price.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: false,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "TARGET_FALLS", target: parseFloat(this.value) },
                    },
                });

                break;
            case "change_in_price_change":
                var { data, error, loading } = await this.mutation_add_change_in_price.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "PRICE_CHANGE", target: parseFloat(this.value) },
                    },
                });

                break;
            case "change_in_price_increase":
                var { data, error, loading } = await this.mutation_add_change_in_price.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "PRICE_CHANGE_INCREASE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "change_in_price_decrease":
                var { data, error, loading } = await this.mutation_add_change_in_price.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "PRICE_CHANGE_DECREASE", target: parseFloat(this.value) },
                    },
                });

                break;
            case "change_in_percent_change":
                var { data, error, loading } = await this.mutation_add_change_in_percent.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "PERCENT_CHANGE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "change_in_percent_increase":
                var { data, error, loading } = await this.mutation_add_change_in_percent.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "PERCENT_CHANGE_INCREASE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "change_in_percent_decrease":
                var { data, error, loading } = await this.mutation_add_change_in_percent.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "PERCENT_CHANGE_DECREASE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "trailing_stop_price":
                var { data, error, loading } = await this.mutation_add_trailing_stop.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "TRAILING_STOP_PRICE_CHANGE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "trailing_stop_percent":
                var { data, error, loading } = await this.mutation_add_trailing_stop.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "TRAILING_STOP_PERCENT_CHANGE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "trailing_high_price":
                var { data, error, loading } = await this.mutation_add_trailing_high.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "TRAILING_BUY_PRICE_CHANGE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "trailing_high_percent":
                var { data, error, loading } = await this.mutation_add_trailing_high.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: "TRAILING_BUY_PERCENT_CHANGE", target: parseFloat(this.value) },
                    },
                });
                break;
            case "earnings_one_day":
                var { data, error, loading } = await this.mutation_add_earnings.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: this.value },
                    },
                });
                break;
            case "earnings_three_days":
                var { data, error, loading } = await this.mutation_add_earnings.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: this.value },
                    },
                });
                break;
            case "earnings_one_week":
                var { data, error, loading } = await this.mutation_add_earnings.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: this.value },
                    },
                });
                break;
            case "earnings_one_month":
                var { data, error, loading } = await this.mutation_add_earnings.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: this.value },
                    },
                });
                break;
            case "time_review_one_month":
            case "time_review_three_months":
            case "time_review_six_months":
            case "time_review_one_year":
            case "time_review_five_years":
                var { data, error, loading } = await this.mutation_add_time_review.mutate({
                    variables: {
                        symbol: this.stock.symbol,
                        repeated: this.repeated,
                        description: this.description,
                        notes: this.notes,
                        notification_types: this.notification_types,
                        alert_info: { trigger: this.value },
                    },
                });
                break;
        }

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `Added alert to ${this.stock.symbol}.`;

            const close = new CustomEvent("close", {
                detail: {
                    value: false,
                },
            });
            this.dispatchEvent(close);
        }
    }

    // --- Other Renders --- //

    private renderForm() {
        switch (this.alertKey) {
            case "target_price_rises":
                return html`
                    <h2 class="formHeader">Rise Target Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleTargetAlertChange}
                            label="Target Price"
                            placeholder="Enter Target Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;margin-top: 3em;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "target_price_falls":
                return html`
                    <h2 class="formHeader">Fall Target Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleTargetAlertChange}
                            label="Target Price"
                            placeholder="Enter Target Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;margin-top: 3em;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_price_change":
                return html`
                    <h2 class="formHeader">Change in Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleChangeInPriceChange}
                            label="Change Price"
                            placeholder="Enter Change in Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_price_increase":
                return html`
                    <h2 class="formHeader">Change in Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleChangeInPriceChange}
                            label="Change Price"
                            placeholder="Enter Change in Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_price_decrease":
                return html`
                    <h2 class="formHeader">Change in Price Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleChangeInPriceChange}
                            label="Change Price"
                            placeholder="Enter Change in Price"
                            prefix="${this.stock.currency_symbol}"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_percent_change":
                return html`
                    <h2 class="formHeader">Change in Percent Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleChangeInPercentChange}
                            label="Change Percent"
                            placeholder="Enter Change in Percent"
                            suffix="%"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_percent_increase":
                return html`
                    <h2 class="formHeader">Change in Percent Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleChangeInPercentChange}
                            label="Change Percent"
                            placeholder="Enter Change in Percent"
                            suffix="%"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "change_in_percent_decrease":
                return html`
                    <h2 class="formHeader">Change in Percent Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>

                        <number-input
                            @on-change=${this.handleChangeInPercentChange}
                            label="Change Percent"
                            placeholder="Enter Change in Percent"
                            suffix="%"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_stop_price":
                return html`
                    <h2 class="formHeader">Price Trailing Stop Loss Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                console.log(e.detail.value);
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <number-input
                            @on-change=${this.handleTrailingStopPriceAlertChange}
                            label="Trailing Price Change"
                            placeholder=""
                            prefix="${this.stock.currency_symbol}"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_stop_percent":
                return html`
                    <h2 class="formHeader">Percent Trailing Stop Loss Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <number-input
                            @on-change=${this.handleTrailingStopPriceAlertChange}
                            label="Trailing Percent Change"
                            placeholder=""
                            suffix="%"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_high_price":
                return html`
                    <h2 class="formHeader">Price Trailing Buy Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <number-input
                            @on-change=${this.handleTrailingBuyPriceAlertChange}
                            label="Trailing Price Change"
                            placeholder=""
                            prefix="${this.stock.currency_symbol}"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "trailing_high_percent":
                return html`
                    <h2 class="formHeader">Percent Trailing Buy Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <number-input
                            @on-change=${this.handleTrailingBuyPriceAlertChange}
                            label="Trailing Percent Change"
                            placeholder=""
                            suffix="%"
                            value=${this.value}
                            meta=${this.meta}
                            metaClass=${this.metaClass}
                            style="width: 50%;"
                        ></number-input>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "earnings_one_day":
                return html`
                    <h2 class="formHeader">Earnings Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target">
                            <option value="oneday" selected>One day before Earnings</option>
                            <option value="threedays">Three days before Earnings</option>
                            <option value="oneweek">One week before Earnings</option>
                            <option value="onemonth">One month before Earnings</option>
                        </select>
                        <label class="label" for="target">Time Before</label>
                    </vaadin-form-layout>
                `;
                break;
            case "earnings_three_days":
                return html`
                    <h2 class="formHeader">Earnings Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target">
                            <option value="oneday">One day before Earnings</option>
                            <option value="threedays" selected>Three days before Earnings</option>
                            <option value="oneweek">One week before Earnings</option>
                            <option value="onemonth">One month before Earnings</option>
                        </select>
                        <label class="label" for="target">Time Before</label>
                    </vaadin-form-layout>
                `;
                break;
            case "earnings_one_week":
                return html`
                    <h2 class="formHeader">Earnings Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target">
                            <option value="oneday">One day before Earnings</option>
                            <option value="threedays">Three days before Earnings</option>
                            <option value="oneweek" selected>One week before Earnings</option>
                            <option value="onemonth">One month before Earnings</option>
                        </select>
                        <label class="label" for="target">Time Before</label>
                    </vaadin-form-layout>
                `;
                break;
            case "earnings_one_month":
                return html`
                    <h2 class="formHeader">Earnings Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target" @change=${this.handleEarningsAlertChange}>
                            <option value="oneday">One day before Earnings</option>
                            <option value="threedays">Three days before Earnings</option>
                            <option value="oneweek">One week before Earnings</option>
                            <option value="onemonth" selected>One month before Earnings</option>
                        </select>
                        <label class="label" for="target">Time Before</label>
                    </vaadin-form-layout>
                `;
                break;
            case "time_review_one_month":
                return html`
                    <h2 class="formHeader">Time Based Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target" @change=${this.handleTimeReviewAlertChange}>
                            <option value="onemonth" selected>One month from now</option>
                            <option value="threemonths">Three months from now</option>
                            <option value="sixmonths">Six months from now</option>
                            <option value="oneyear">One year from now</option>
                            <option value="fiveyears">Five years from now</option>
                        </select>
                        <label class="label" for="target">Time</label>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "time_review_three_months":
                return html`
                    <h2 class="formHeader">Time Based Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target" @change=${this.handleTimeReviewAlertChange}>
                            <option value="onemonth">One month from now</option>
                            <option value="threemonths" selected>Three months from now</option>
                            <option value="sixmonths">Six months from now</option>
                            <option value="oneyear">One year from now</option>
                            <option value="fiveyears">Five years from now</option>
                        </select>
                        <label class="label" for="target">Time</label>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "time_review_six_months":
                return html`
                    <h2 class="formHeader">Time Based Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target" @change=${this.handleTimeReviewAlertChange}>
                            <option value="onemonth">One month from now</option>
                            <option value="threemonths">Three months from now</option>
                            <option value="sixmonths" selected>Six months from now</option>
                            <option value="oneyear">One year from now</option>
                            <option value="fiveyears">Five years from now</option>
                        </select>
                        <label class="label" for="target">Time</label>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "time_review_one_year":
                return html`
                    <h2 class="formHeader">Time Based Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target" @change=${this.handleTimeReviewAlertChange}>
                            <option value="onemonth">One month from now</option>
                            <option value="threemonths">Three months from now</option>
                            <option value="sixmonths">Six months from now</option>
                            <option value="oneyear" selected>One year from now</option>
                            <option value="fiveyears">Five years from now</option>
                        </select>
                        <label class="label" for="target">Time</label>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
            case "time_review_five_years":
                return html`
                    <h2 class="formHeader">Time Based Alert</h2>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <toggle-group
                            helpButton
                            label="Alert Type"
                            .items=${this.toggle_group_type}
                            @selected-change=${(e) => {
                                this.repeated = e.detail.value == "REPEATED" ? true : false;
                            }}
                        >
                            <div slot="help">
                                <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                            </div>
                        </toggle-group>
                        <toggle-group
                            helpButton
                            label="Notification Channels"
                            @selected-change=${(e) => {
                                this.notification_types = e.detail.value;
                                this.validate();
                            }}
                            .items=${this.toggle_group_notification_types}
                            selectMany
                        >
                            <div slot="help">
                                Select notification channel (multiple selection allowed):
                                <p>Email: You will be notified by email. Multiple alerts could be grouped into a single email.</p>
                                <p>Push: You will be notified by push notifications.</p>
                                <p><a href=${urlForName("history")}>notification history</a></p>
                                <p><a href="">what type of notification should I use?</a></p>
                            </div>
                        </toggle-group>
                        <select name="target" @change=${this.handleTimeReviewAlertChange}>
                            <option value="onemonth">One month from now</option>
                            <option value="threemonths">Three months from now</option>
                            <option value="sixmonths">Six months from now</option>
                            <option value="oneyear">One year from now</option>
                            <option value="fiveyears" selected>Five years from now</option>
                        </select>
                        <label class="label" for="target">Time</label>
                        <text-area
                            label="Notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                    </vaadin-form-layout>
                `;
                break;
        }
    }

    render() {
        return html`
            <generic-notification
                ?opened=${this.notificationOpened}
                .text="${this.notificationText}"
                @opened-changed="${(e: NotificationOpenedChangedEvent) => {
                    this.notificationOpened = e.detail.value;
                }}"
            ></generic-notification>

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
                <vaadin-button theme="primary contrast" style="float: right;" ?disabled=${this.disableSubmit} @click=${this.handleAddAlert}>Save Alert</vaadin-button>
            </div>
        `;
    }
}

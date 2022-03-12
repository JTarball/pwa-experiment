/* Full Page Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import "fa-icons";
import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import { FormLayoutResponsiveStep } from "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { UserStock } from "../../../store/models.js";

import "./add-alert-form";
import "./select-stock";

type MenuPage = {
    enabled: boolean;
    title: Function;
    description: String;
    back: String;
    options: [Object];
};

type MenuPageMap = {
    [key: string]: MenuPage;
};

@customElement("addalert-modal")
class AddAlertModal extends LitElement {
    /* Properties */

    @property()
    stock: UserStock; // The current stoock

    @property()
    title: String = "";

    @property({ type: Boolean, reflect: false })
    open: boolean = false;

    @query(".wrapper")
    _wrapper: Element;

    /* Boolean displays  */
    @property({ type: Boolean, reflect: false })
    showSelectStock: boolean;

    /* End of boolean displays  */

    @state()
    alertKey: string = "";

    // Price Target  ->
    // Price Change ->
    // Percent Change from Now ->  decrease/increase/both

    // Trailing Stop  -> Percent / Price Difference
    // Trailing High -> Percent / Difference
    // ---------
    // Earnings Alert ->
    // Time Review Alert -> time { REVIEW_ONE_MONTH = 0; REVIEW_THREE_MONTH = 1; REVIEW_SIX_MONTH = 2; REVIEW_ONE_YEAR = 3; REVIEW_FIVE_YEAR = 3; }
    // Technicals -> p/e ratio or peg ratio

    options_1 = [
        { title: "Target Price", description: "Select a specific price to alert on", icon: "vaadin:dollar" },
        { title: "Change In Price", description: "Alerts on a price difference compared to the current price.", icon: "vaadin:plus-minus" },
        { title: "Change In Percent", description: "Alerts on a percent difference compared to the current price", icon: "vaadin:book-percent" },
        { skip: true },
        { title: "Trailing Stop", description: "Trails the price of the stock, only triggered when price dips", icon: "vaadin:trending-down", iconStyleClass: "trendingDownIcon" },
        { title: "Trailing High", description: "Trails the price of the stock, only triggered when price rises", icon: "vaadin:trending-up", iconStyleClass: "trendingUpIcon" },
        { skip: true },
        { title: "Earnings Alert", description: "Alert on an earnings call", icon: "vaadin:calendar-briefcase" },
        { title: "Time Review Alert", description: "Notification for a specific time in the future e.g. to review a stock position", icon: "vaadin:time-forward" },
        { title: "Technicals", description: "Alert on a specific technical indicator e.g. peg ratio, pe ratio ..", icon: "vaadin:chart-grid" },
    ];

    @state()
    title_1 = `Add an alert to ${this.stock?.symbol}`;

    description_1 = "";

    options_2_trailing_stop = [
        { title: "Percent", description: "Select a price to alert on", icon: "vaadin:book-percent" },
        { title: "Price", description: "Select a price to alert on", icon: "vaadin:arrows-long-up" },
    ];
    description_2_trailing_stop = "";

    options_2_target_price = [
        { title: "On Rises", description: "Triggers on when the prices rises above the target price.", icon: "vaadin:arrow-up", onClick: this.showForm },
        { title: "On Falls", description: "Triggers on when the prices falls below the target price.", icon: "vaadin:arrow-down" },
    ];
    description_2_target_price = "A target price alert generates an alert when the price is reached.";

    @state()
    title_current: String = `Add an alert to ${this.stock?.symbol}`;

    @state()
    description_current: String = "";

    @state()
    back_items: Array = [];

    @state()
    back_title: String = "";

    @state()
    showAdd: Boolean = false;

    @state()
    stock: Object; // The stock you wish to generate an alert for

    // --- Menu Page --- //
    @state()
    menu: MenuPageMap = {
        root: {
            title: () => {
                return `Add an alert to ${this.stock?.symbol}`;
            },
            description: "Alerts are separated into changes, trailing & other alerts. Do not rely solely on these alerts, these will not replace traditional day trading orders.",
            options: [
                { title: "Target Price", description: "Select a specific price to alert on", icon: "vaadin:dollar", click: "target_price" },
                { title: "Change In Price", description: "Alerts on a price difference compared to the current price.", icon: "vaadin:plus-minus", click: "change_in_price" },
                { title: "Change In Percent", description: "Alerts on a percent difference compared to the current price", icon: "vaadin:book-percent", click: "change_in_percent" },
                { skip: true, disabled: true },
                {
                    title: "Trailing Stop",
                    description: "Trails the price of the stock, only triggered when price dips",
                    icon: "vaadin:trending-down",
                    iconStyleClass: "trendingDownIcon",
                    click: "trailing_stop",
                },
                {
                    title: "Trailing High",
                    description: "Trails the price of the stock, only triggered when price rises",
                    icon: "vaadin:trending-up",
                    iconStyleClass: "trendingUpIcon",
                    click: "trailing_high",
                },
                { skip: true, disabled: true },
                { title: "Earnings Alert", description: "Alert on an earnings call", icon: "vaadin:calendar-briefcase", click: "earnings" },
                { title: "Time Review Alert", description: "Notification for a specific time in the future e.g. to review a stock position", icon: "vaadin:time-forward", click: "time_review" },
                {
                    title: "Technicals (Coming soon)",
                    description: "Alert on a specific technical indicator e.g. peg ratio, pe ratio ..",
                    icon: "vaadin:chart-grid",
                    click: "technicals",
                    disabled: true,
                },
            ],
        },
        target_price: {
            title: () => {
                return `Target Price for ${this.stock?.symbol}`;
            },
            description: "A target price alert generates an alert when the price is reached.",
            options: [
                { title: "On Rises", description: "Triggers on when the prices rises above the target price.", icon: "vaadin:arrow-up", formKey: "target_price_rises" },
                { title: "On Falls", description: "Triggers on when the prices falls below the target price.", icon: "vaadin:arrow-down", formKey: "target_price_falls" },
            ],
            back: "root",
            clickForm: true,
        },
        change_in_price: {
            title: () => {
                return `Change in Price for ${this.stock?.symbol}`;
            },
            description: "Change in price from current.",
            options: [
                { title: "Increase", description: "Triggers when the prices increases above the current price by X.", icon: "vaadin:arrow-up", formKey: "change_in_price_increase" },
                { title: "Decrease", description: "Triggers when the prices decreases below the current price by X.", icon: "vaadin:arrow-down", formKey: "change_in_price_decrease" },
                { title: "Change", description: "Triggers when the price decreases or increases by X from its current price.", icon: "vaadin:arrows-long-v", formKey: "change_in_price_change" },
            ],
            back: "root",
            clickForm: true,
        },
        change_in_percent: {
            title: () => {
                return `Change in Percent for ${this.stock?.symbol}`;
            },
            description: "Change in percent from current.",
            options: [
                { title: "Increase", description: "Triggers when the price increases above the current price by X.", icon: "vaadin:arrows-long-up", formKey: "change_in_percent_increase" },
                { title: "Decrease", description: "Triggers when the price decreases below the current price by X.", icon: "vaadin:arrow-long-down", formKey: "change_in_percent_decrease" },
                { title: "Change", description: "Triggers when the price changes by X in any direction from its current price.", icon: "vaadin:arrows-long-v", formKey: "change_in_percent_change" },
            ],
            back: "root",
            clickForm: true,
        },
        trailing_stop: {
            title: () => {
                return `Trailing stop loss for ${this.stock?.symbol}`;
            },
            description:
                "An alert that simulates a trailing stop loss order technique adjusting the stop price at a fixed percent or number of points below the market price of a stock. The technique is used to specify a maximum possible loss without setting a limit on gains.",
            options: [
                { title: "Price", description: "Triggers when the price increases above the current price by X.", icon: "", formKey: "trailing_stop_price" },
                { title: "Percent", description: "Triggers when the price decreases below the current price by X.", icon: "", formKey: "trailing_stop_percent" },
            ],
            back: "root",
            clickForm: true,
        },
        trailing_high: {
            title: () => {
                return `Trailing buy stop for ${this.stock?.symbol}`;
            },
            description:
                "An alert that simulates a trailing buy stop order technique trailing the market price adjusting the stop price only triggering when the price increases above the trigger. Most appropriate for falling markets and considered the mirror of stop loss orders.",
            options: [
                { title: "Price", description: "Trailing the market, triggers when the price increases above the current price by X.", icon: "", formKey: "trailing_high_price" },
                { title: "Percent", description: "Trailing the market, triggers when the percent increases above X.", icon: "", formKey: "trailing_high_percent" },
            ],
            back: "root",
            clickForm: true,
        },
        earnings: {
            title: () => {
                return `Earnings alert for ${this.stock?.symbol}`;
            },
            description: "Be alerted to future earnings calls.",
            options: [
                { title: "One Day Before", description: "Triggers a day before earnings.", icon: "", formKey: "earnings_one_day" },
                { title: "Three Days Before", description: "Triggers three days before earnings.", icon: "", formKey: "earnings_three_days" },
                { title: "One Week Before", description: "Triggers one week before earnings.", icon: "", formKey: "earnings_one_week" },
                { title: "One Month Before", description: "Triggers one month before earnings.", icon: "", formKey: "earnings_one_month" },
            ],
            back: "root",
            clickForm: true,
        },
        time_review: {
            title: () => {
                return `Time based alert for ${this.stock?.symbol}`;
            },
            description: "An alert based on time e.g. review portfolio in 6 months",
            options: [
                { title: "In One Month", description: "Triggers a time review in one month.", icon: "", formKey: "time_review_one_month" },
                { title: "In Three Months", description: "Triggers a time review in three months.", icon: "", formKey: "time_review_three_months" },
                { title: "In Six Months", description: "Triggers a time review in six months.", icon: "", formKey: "time_review_six_months" },
                { title: "In One Year", description: "Triggers a time review in one year.", icon: "", formKey: "time_review_one_year" },
                { title: "In Five Years", description: "Triggers a time review in five years.", icon: "", formKey: "time_review_five_years" },
            ],
            back: "root",
            clickForm: true,
        },
        technicals: {
            title: () => {
                return `Trailing stop loss for ${this.stock?.symbol}`;
            },
            description: "A trailing stop loss order adjusts the stop price at a fixed percent or number of points below or above the market price of a stock.",
            options: [
                { title: "In One Month", description: "Triggers a time review in one month.", icon: "", formKey: "time_review_one_month" },
                { title: "In Three Months", description: "Triggers a time review in three months.", icon: "", formKey: "time_review_three_months" },
                { title: "In Six Months", description: "Triggers a time review in six months.", icon: "", formKey: "time_review_six_months" },
                { title: "In One Year", description: "Triggers a time review in one year.", icon: "", formKey: "time_review_one_year" },
                { title: "In Five Years", description: "Triggers a time review in five years.", icon: "", formKey: "time_review_five_years" },
            ],
            back: "root",
            clickForm: true,
        },
    }; // A container for display nested menu options

    @property()
    menuKey: String = "root";

    @query("#close")
    close: Element;

    // --- End of properties, queries etc. --- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            /* Wrapper */
            .wrapper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                z-index: 100;
                background-color: var(--lumo-base-color);
            }

            .wrapper:not(.open) {
                animation: slideFromTop 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                visibility: hidden;
            }

            .wrapper.open {
                opacity: 1;
                visibility: visible;
                animation: 0.08s 0.03s slideFromBottom cubic-bezier(0.215, 0.61, 0.355, 1) both;
            }

            .wrapper.closing {
                animation: slideFromTop 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            }

            @keyframes slideFromBottom {
                0% {
                    transform: translateY(90%);
                }
                100% {
                    transform: translateY(0);
                }
            }

            @keyframes slideFromTop {
                0% {
                    transform: translateY(5%);
                }
                100% {
                    transform: translateY(100%);
                }
            }
            /* End of Wrapper */

            header {
                display: flex;
                align-items: center;
                height: 53px;
                padding: 0 1rem;
            }

            .content {
                padding-left: 5px;
                padding-right: 5px;
            }

            /* Table */
            tr {
                cursor: pointer;
            }

            /* End of Table */

            /* Icon */

            #back {
                cursor: pointer;
            }

            #close {
                cursor: pointer;
                height: 24px;
                color: var(--lumo-secondary-text-color);
                margin-left: 8px;
                margin-right: 8px;
                font-size: 16px;
                width: 44px;
            }

            #title {
                text-align: left;
                width: 300px;
            }

            .optionIcon {
                border-radius: 50%;
                padding: 9px;

                background-color: #60647d;
                background-color: #ecf9f2;
                background-color: #250902;
                background-color: black;

                color: white;

                width: 32px;
                height: 32px;
            }

            /* Icon styling */
            .trendingDownIcon {
                background-color: #ffe6e8;
                color: var(--lumo-error-color);
            }

            .trendingUpIcon {
                background-color: #ecf9f2;
                color: var(--lumo-success-color);
            }

            /* End of icon styling */
            table th span.headerTitle {
                color: var(--lumo-contrast);
            }
            table th span.headerDescription {
                font-family: var(--lumo-font-family);
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-micro);
                padding: 1em;
            }
        `,
    ];

    private firstUpdated() {
        this.items_current = this.options_1;
    }

    private handleOptionClick(e: Event, item) {
        // console.log("handleOptionClick,");
        // if (item.onClick) {
        //     this.back_title = this.title_current;
        //     this.back_items = this.options_1;
        //     this.showAdd = true;
        // } else {
        //     switch (item.title) {
        //         case "Target Price":
        //             console.log("From trailing stop");
        //             this.back_title = this.title_current;
        //             this.back_items = this.options_1;
        //             this.items_current = this.options_2_target_price;
        //             this.title_current = item.title;
        //             this.description_current = this.description_2_target_price;
        //             break;
        //         case "Trailing Stop":
        //             console.log("From trailing stop");
        //             this.items_current = this.options_2_trailing_stop;
        //             this.title_current = item.title;
        //             break;
        //         default:
        //     }
        // }
    }

    private renderTitle() {
        return html`Add an alert to ${this.stock.symbol}`;
    }

    private showForm() {}

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        { minWidth: 0, columns: 1 },
        { minWidth: "20em", columns: 3 },
    ];

    private handleSelectStock(e: Event) {
        console.log("handleSelectStock", e);
        this.showSelectStock = false;
        this.stock = e.detail.stock;
    }

    // -- Other Renders -- //
    private renderAlertMenu() {
        return html`
            <table class="yld0">
                <thead>
                    <tr>
                        <th style="vertical-align: bottom;">
                            <vaadin-vertical-layout>
                                <span class="headerTitle">${this.menu[this.menuKey]?.title()}</span>
                                <span class="headerDescription">${this.menu[this.menuKey]?.description}</span>
                            </vaadin-vertical-layout>
                        </th>
                        <th></th>
                    </tr>
                    <thead></thead>
                </thead>
                ${this.menu[this.menuKey]?.options.map((item, index) => {
                    let classes = { disabled: item.disabled };
                    return html`
                        <tr
                            role="row"
                            index="${index}"
                            @click=${(e) => {
                                if (this.menu[this.menuKey].clickForm) {
                                    console.log("clickForm", this.menu[this.menuKey], item);
                                    this.alertKey = item.formKey;

                                    this.showAdd = true;
                                } else {
                                    this.menuKey = item.click;
                                }
                            }}
                            class="${classMap(classes)}"
                        >
                            <td style="width: 65%;">
                                ${item.skip
                                    ? html``
                                    : html` <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                          ${item.icon.startsWith("fa")
                                              ? html`<fa-icon class="fas ${item.icon}" style="fill: white;height: 3em;width: 3em; background-color: black;border-radius: 50%; padding: 5px;"></fa-icon>`
                                              : html` ${item.icon
                                                    ? html`<vaadin-icon class="optionIcon ${item.iconStyleClass}" icon=${item.icon} theme="small"></vaadin-icon>`
                                                    : html`<vaadin-avatar name="${item.title}" theme="xsmall"></vaadin-avatar>`}`}

                                          <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                              <span class="title">${item.title} </span>
                                              <span class="description">${item.description}</span>
                                          </vaadin-vertical-layout>
                                      </vaadin-horizontal-layout>`}
                            </td>

                            <td style="width: 10%;">
                                <!-- <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                    <vaadin-button id="addToWatch">Add to watch</vaadin-button>
                                </vaadin-vertical-layout> -->
                            </td>
                        </tr>
                    `;
                })}
            </table>
        `;
    }

    // -- Main Render -- //
    render() {
        return html`
            <div class="wrapper ${this.open ? "open" : ""}">
                <header class="bg-base border-b border-contrast-10 box-border flex h-xl items-center w-full" slot="navbar">
                    ${this.showSelectStock
                        ? html``
                        : html` <vaadin-icon
                              id="back"
                              icon="lumo:angle-left"
                              @click=${() => {
                                  if (this.menu[this.menuKey].clickForm && this.showAdd) {
                                      this.showAdd = false;
                                  } else if (this.menu[this.menuKey].back) {
                                      this.menuKey = this.menu[this.menuKey].back;
                                  } else if (this.menuKey == "root") {
                                      this.showSelectStock = true;
                                  }
                              }}
                          ></vaadin-icon>`}

                    <vaadin-vertical-layout class="m-auto" style="line-height: var(--lumo-line-height-m);">
                        <span id="title">${this.title}</span>
                    </vaadin-vertical-layout>
                    <vaadin-icon
                        id="close"
                        icon="lumo:cross"
                        @click=${() => {
                            this._wrapper.classList.add("closing");

                            // Lazy way to wait for css slide out transition
                            setTimeout(() => {
                                const closed = new CustomEvent("closed", {
                                    detail: {
                                        value: false,
                                    },
                                });
                                this.dispatchEvent(closed);
                                this._wrapper.classList.remove("closing");
                            }, 500);
                        }}
                    ></vaadin-icon>
                </header>
                <section>
                    <div id="content" class="content">
                        ${this.showSelectStock
                            ? html`<select-stock @addalert=${this.handleSelectStock}></select-stock>`
                            : html`${this.showAdd
                                  ? html`<addalert-form
                                        @close=${() => {
                                            this.close.click();
                                            this.menuKey = "root";
                                            this.showAdd = false;
                                        }}
                                        .stock=${this.stock}
                                        .alertKey=${this.alertKey}
                                    ></addalert-form>`
                                  : html`${this.renderAlertMenu()}`} `}
                        <slot></slot>
                    </div>
                </section>
            </div>
        `;
    }
}

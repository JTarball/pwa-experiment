/* Full Page Modal */
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/grid";
import "@vaadin/button";
import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/text-field";
import "@vaadin/vertical-layout";
import "@vaadin/text-area";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { IPOCalendar, DividendCalendar } from "../../../store/models.js";

import "../page-modal.js";

@customElement("insight-calendar")
class YLD0InsightCalendar extends LitElement {
    //
    // Properties, states

    @property()
    private modalOpen: Boolean = false;

    @property()
    private modalTitle: String = "";

    @state()
    private ipo_calendar?: IPOCalendar[];

    @state()
    private dividend_calendar?: DividendCalendar[];

    @state()
    private earnings_calendar?: EarningsCalendar[];

    @state()
    private calendars: String[] = [
        ["Upcoming IPO Calendar", "ipo_calendar", "tableHeaderRenderer", "trRenderer"],
        ["Upcoming Dividend Calendar", "dividend_calendar", "tableDividendHeaderRenderer", "trDividendRenderer"],
        ["Upcoming Earnings Calendar", "earnings_calendar", "tableEarningsHeaderRenderer", "trEarningsRenderer"],
    ]; // title, items attribute, renderer attribute

    // End of properties ...

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            section {
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-xxs);
            }

            table {
                border-collapse: collapse;
                width: 100%;
                margin-top: 20px;
                margin-bottom: 60px;
            }

            table tr,
            table td {
                transition: transform 0.35s ease-out;
                border-color: var(--lumo-contrast-10pct);
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding-top: 8px;
                padding-bottom: 8px;
            }

            /* table thead tr {
                border-bottom-width: 0px;
            } */

            table th {
                padding: 10px;
                text-align: left;
            }

            .rubberband {
                -webkit-animation-name: rubberBand;
                animation-name: rubberBand;
            }

            .tdDeleteRow {
                position: absolute;
                right: -100px;
                display: none;
                opacity: 0;
                visibility: hidden;
                transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
            }
            .tdDeleteRow[active] {
                visibility: visible;
                display: flex;
                opacity: 1;
            }

            button:hover {
                animation-name: rubberBand;
            }

            @media screen and (max-width: 355px) {
                table {
                    width: 100%;
                    margin-top: 50px;
                }

                table thead {
                    display: none;
                }

                table tr,
                table td {
                    border-bottom: 1px solid #ddd;
                }

                table tr {
                    margin-top: 8px;
                    margin-bottom: 8px;
                }

                table td {
                    display: flex;
                }

                table td::before {
                    content: attr(label);
                    font-weight: bold;
                }
            }

            /* yld0 Table styling */
            table th span.headerTitle {
                font-size: 1em;
                color: var(--lumo-primary-text-color);
            }

            table th span {
                font-size: 0.7em;
                color: var(--lumo-secondary-text-color);
            }

            table td span {
                color: var(--lumo-secondary-text-color);
            }

            table td span.stockSymbol {
                padding-right: 8px;
                color: var(--lumo-primary-text-color);
                font-weight: 500;
            }

            table td span.companyName {
                font-size: var(--lumo-font-size-tiny);
                color: var(--lumo-secondary-text-color);
            }

            /* End of table styling */
        `,
    ];

    async firstUpdated() {
        const ipo_calendar: IPOCalendar[] = [
            {
                symbol: "SIDU",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                date: "2021-12-16",
                exchange: "NASDAQ Capital",
                companyName: "Sidus Space Inc.",
                numberOfShares: 3000000,
                priceRange: "$4.00-6.00",
                statusOfIPO: "expected",
                marketCap: "18M",
            },
            {
                symbol: "SIDU",

                date: "2021-12-16",
                exchange: "NASDAQ Capital",
                companyName: "Sidus Space Inc.",
                numberOfShares: 3000000,
                priceRange: "$4.00-6.00",
                statusOfIPO: "expected",
                marketCap: "18M",
            },
            {
                symbol: "SIDU",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                date: "2021-12-16",
                exchange: "NASDAQ Capital",
                companyName: "Sidus Space Inc.",
                numberOfShares: 3000000,
                priceRange: "$4.00-6.00",
                statusOfIPO: "expected",
                marketCap: "18M",
            },
            {
                symbol: "SIDU",
                logoUrl: "",
                date: "2021-12-16",
                exchange: "NASDAQ Capital",
                companyName: "Sidus Space Inc.",
                numberOfShares: 3000000,
                priceRange: "$4.00-6.00",
                statusOfIPO: "expected",
                marketCap: "18M",
            },
            {
                symbol: "SIDU",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                date: "2021-12-16",
                exchange: "NASDAQ Capital",
                companyName: "Sidus Space Inc.",
                numberOfShares: 3000000,
                priceRange: "$4.00-6.00",
                statusOfIPO: "expected",
                marketCap: "18M",
            },
            {
                symbol: "SIDU",
                logoUrl: "",
                date: "2021-12-16",
                exchange: "NASDAQ Capital",
                companyName: "Sidus Space Inc.",
                numberOfShares: 3000000,
                priceRange: "$4.00-6.00",
                statusOfIPO: "expected",
                marketCap: "18M",
            },
            {
                symbol: "SIDU",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                date: "2021-12-16",
                exchange: "NASDAQ Capital",
                companyName: "Sidus Space Inc.",
                numberOfShares: 3000000,
                priceRange: "$4.00-6.00",
                statusOfIPO: "expected",
                marketCap: "18M",
            },
        ];
        this.ipo_calendar = ipo_calendar;

        const dividend_calendar: DividendCalendar[] = [
            {
                symbol: "BOL.PA",
                logoUrl: "",
                date: "2021-12-16",
                companyName: "Bolloré SE",
                dividend: "0.47",
            },
        ];
        this.dividend_calendar = dividend_calendar;

        const earnings_calendar: DividendCalendar[] = [
            {
                symbol: "BOL.PA",
                logoUrl: "",
                date: "2021-12-16",
                companyName: "Bolloré SE",
                eps: "unknown",
                epsEstimated: "0.27",
                revenue: "0",
                revenueEstimated: "1.2B",
            },
            {
                symbol: "BOL.PA",
                logoUrl: "",
                date: "2021-12-16",
                companyName: "Bolloré SE",
                eps: "unknown",
                epsEstimated: "0.27",
                revenue: "0",
                revenueEstimated: "1.2B",
            },
        ];
        this.earnings_calendar = earnings_calendar;
    }

    private modalContentRenderer(trRendererFunc, items: IPOCalendar[]) {
        return html`
            <table class="yld0">
                ${items?.map((i, index) => trRendererFunc(i, index))}
            </table>
        `;
    }

    private tableRenderer(title: String, attribute: string, headerRendererAttribute: string, trRendererAttribute: String) {
        var items = this[attribute];
        var funcHeaderRenderer = this[headerRendererAttribute];
        var funcRenderer = this[trRendererAttribute];

        console.log(items);
        return html`
            <table class="yld0">
                ${funcHeaderRenderer(title)} ${items?.slice(0, 5).map((i, index) => funcRenderer(i, index))}
                ${items?.length > 0
                    ? html`<tr>
                          <vaadin-button
                              style="margin-left: 10px; padding-left: 2em; padding-right: 2em; font-size: var(--lumo-font-size-xxs)"
                              theme="badge"
                              @click="${(e: CustomEvent) => {
                                  this.modalTitle = title;
                                  this.modalRenderer = this.modalContentRenderer(funcRenderer, items);
                                  this.modalOpen = true;
                              }}"
                              >see all</vaadin-button
                          >
                      </tr>`
                    : html``}
            </table>
        `;
    }

    private tableHeaderRenderer = (title: String) => {
        return html`
            <thead>
                <tr>
                    <th><span class="headerTitle">${title}</span></th>
                    <th><span>priceRange | marketCap</span></th>
                    <th><span>status</span></th>
                </tr>
                <thead></thead>
            </thead>
        `;
    };

    private tableDividendHeaderRenderer = (title: String) => {
        return html`
            <thead>
                <tr>
                    <th><span class="headerTitle">${title}</span></th>
                    <th><span>dividend</span></th>
                </tr>
                <thead></thead>
            </thead>
        `;
    };

    private tableEarningsHeaderRenderer = (title: String) => {
        return html`
            <thead>
                <tr>
                    <th><span class="headerTitle">${title}</span></th>
                    <th><span>eps | epsEstimated | revenue | revEstimated</span></th>
                </tr>
                <thead></thead>
            </thead>
        `;
    };

    private trRenderer = (item: IPOCalendar, index: Number) => {
        return html`
            <tr role="row" index="${index}">
                <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                <td style="width: 50%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-avatar img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span>
                                <span class="stockSymbol">${item.symbol} </span>
                                <span style="font-size: 0.8em;">${item.date}</span>
                            </span>
                            <span class="companyName">${item.companyName}</span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width: 40%;">
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <span style="font-size: var(--lumo-font-size-micro); color: var(--lumo-secondary-text-color);">${item.priceRange} | ${item.marketCap}</span>
                    </vaadin-vertical-layout>
                </td>
                <td style="width: 10%;"><span style="font-size: 0.8em;" theme="badge">${item.statusOfIPO}</span></td>
            </tr>
        `;
    };

    private trDividendRenderer = (item: DividendCalendar, index: Number) => {
        return html`
            <tr role="row" index="${index}">
                <td style="width: 90%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-avatar img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span>
                                <span class="stockSymbol">${item.symbol} </span>
                                <span style="font-size: 0.8em;">${item.date}</span>
                            </span>
                            <span class="companyName">${item.companyName}</span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width: 10%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <div style="text-align: center;">
                                <span style="padding-left: 1em; font-size: var(--lumo-font-size-micro); color: var(--lumo-secondary-text-color); text-align:center;">${item.dividend}</span>
                            </div>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
            </tr>
        `;
    };

    private trEarningsRenderer = (item: DividendCalendar, index: Number) => {
        return html`
            <tr role="row" index="${index}">
                <td style="width: 60%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-avatar img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span>
                                <span class="stockSymbol">${item.symbol} </span>
                                <span style="font-size: 0.8em;">${item.date}</span>
                            </span>
                            <span class="companyName">${item.companyName}</span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width: 40%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <div style="text-align: center;">
                                <span style="padding-left: 1em; font-size: var(--lumo-font-size-tiny); color: var(--lumo-secondary-text-color);">
                                    ${item.revenue} | ${item.revenueEstimated} | ${item.eps} | ${item.epsEstimated}</span
                                >
                            </div>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
            </tr>
        `;
    };

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                ${this.calendars?.map((cal) => {
                    let [title, att, rendererHeaderAtt, rendererAtt] = cal;
                    return this.tableRenderer(title, att, rendererHeaderAtt, rendererAtt);
                })}
            </section>
            <br />
            <!-- slot, just in case -->
            <slot></slot>

            <page-modal title="${this.modalTitle}" ?open="${this.modalOpen}" @closed="${(e: CustomEvent) => (this.modalOpen = e.detail.value)}"> ${this.modalRenderer}</page-modal>
        `;
    }
}

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

@customElement("insight-trends")
class YLD0InsightTrends extends LitElement {
    /* Properties, states etc. */

    @property({ type: Boolean, reflect: true })
    private modalOpen: Boolean = false;

    @property({ type: String, reflect: true })
    private modalTitle: String = "";

    @property()
    private modalRenderer: TemplateResult;

    @state()
    private items_day_gainers?: TrendStat[];

    @state()
    private items_day_losers?: TrendStat[];

    @state()
    private items_day_active?: TrendStat[];

    @state()
    private items_top_crypto?: TrendStat[];

    @state()
    private items_sector_performance?: TrendStat[];

    @state()
    private stats: String[] = [
        ["Day Gainers", "items_day_gainers", "tableHeaderRenderer", "trRenderer"],
        ["Day Losers", "items_day_losers", "tableHeaderRenderer", "trRenderer"],
        ["Day Most Active", "items_day_active", "tableHeaderRenderer", "trRenderer"],
        ["Top Crypto", "items_top_crypto", "tableHeaderRenderer", "trRenderer"],
        ["Sector Performance", "items_sector_performance", "tableHeaderRenderer", "trRenderer"],
    ]; // title, items attribute, header renderer attribute, tr render attribute

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
                text-align: center;
                vertical-align: middle;
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

            table td span.success {
                color: var(--lumo-success-color);
            }

            table td span.error {
                color: var(--lumo-error-color);
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
        const items_day_gainers: TrendStat[] = [
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
        ];
        this.items_day_gainers = items_day_gainers;

        const items_day_losers: TrendStat[] = [
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "-3.00",
                priceChangePercent: "-0.3",
            },
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: null,
                price: "$348",
                priceChange: "-5",
                priceChangePercent: "-0.345",
            },
        ];
        this.items_day_losers = items_day_losers;

        const items_day_active: TrendStat[] = [
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
        ];
        this.items_day_active = items_day_active;

        const items_top_crypto: TrendStat[] = [
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
        ];
        this.items_top_crypto = items_top_crypto;

        const items_sector_performance: TrendStat[] = [
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
            },
        ];
        this.items_sector_performance = items_sector_performance;
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

                                  var event = new CustomEvent("modalopen-changed", { detail: { modalOpen: this.modalOpen, modalTitle: this.modalTitle, modalRenderer: this.modalRenderer } });
                                  this.dispatchEvent(event);
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
                    <th><span>priceChange</span></th>
                </tr>
                <thead></thead>
            </thead>
        `;
    };

    private trRenderer = (item: IPOCalendar, index: Number) => {
        return html`
            <tr role="row" index="${index}">
                <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                <td style="width: 60%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-avatar img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span class="stockSymbol">${item.symbol} </span>
                            <span class="companyName">${item.companyName}</span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width: 40%;">
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <span style="padding-left: 10px; font-size: 1.2em; color: var(--primary-text-color);">${item.price}</span>
                        <span>
                            ${item.priceChange ? html`<span class="${item.priceChange > 0 ? "success" : "error"}">1d ${item.priceChange > 0 ? "+" : ""}${item.priceChange}</span>` : html`?`} |
                            ${item.priceChangePercent
                                ? html`<span theme="badge small ${item.priceChangePercent > 0 ? "success" : "error"}">${item.priceChangePercent > 0 ? "+" : ""}${item.priceChangePercent}%</span>`
                                : html`?`}
                        </span>
                    </vaadin-vertical-layout>
                </td>
            </tr>
        `;
    };

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                ${this.stats?.map((cal) => {
                    let [title, att, rendererHeaderAtt, rendererAtt] = cal;
                    return this.tableRenderer(title, att, rendererHeaderAtt, rendererAtt);
                })}
            </section>
            <br />
            <!-- slot, just in case -->
            <slot></slot>

            <!-- <page-modal title="${this.modalTitle}" ?open="${this.modalOpen}" @closed="${(e: CustomEvent) => (this.modalOpen = e.detail.value)}"> ${this.modalRenderer}</page-modal> -->
        `;
    }
}

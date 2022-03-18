/* Full Page Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";
import { guard } from "lit/directives/guard.js";

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
import { StockInsightItem } from "../../../store/models.js";
import { truncate } from "../../../helpers/utilities/helpers.js";

@customElement("stock-insight")
class YLD0StockInsight extends LitElement {
    //
    // Properties, states
    @state()
    private items?: StockInsightItem[];

    @property()
    private dialogItem?: StockInsightItem;

    @state()
    private dialogOpened = false;

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
                font-size: var(--lumo-font-size-s);
            }

            th,
            td {
                /* background: #eee; */
                padding: 8px;
            }

            tr {
                transition: transform 0.35s ease-out;
                /*transition: all 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55);*/
                /* transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
                transition-duration: 0.9s; */
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

            @keyframes rubberBand {
                from {
                    transform: scale3d(1, 1, 1);
                }

                30% {
                    transform: scale3d(1.25, 0.75, 1);
                }

                40% {
                    transform: scale3d(0.75, 1.25, 1);
                }

                50% {
                    transform: scale3d(1.15, 0.85, 1);
                }

                65% {
                    transform: scale3d(0.95, 1.05, 1);
                }

                75% {
                    transform: scale3d(1.05, 0.95, 1);
                }

                to {
                    transform: scale3d(1, 1, 1);
                }
            }

            @media screen and (max-width: 350px) {
                table {
                    width: 100%;
                }

                table thead {
                    display: none;
                }

                table tr,
                table td {
                    border-bottom: 1px solid #ddd;
                }

                table tr {
                    margin-bottom: 8px;
                }

                table td {
                    display: flex;
                }

                table td::before {
                    content: attr(label);
                    font-weight: bold;
                    /*width: 120px;
                    min-width: 120px;*/
                }
            }
        `,
    ];

    async firstUpdated() {
        const items: StockInsightItem[] = [
            {
                key: "peg_ratio",
                value: "2.14",
                title: "PEG ratio",
                comparison: "The average peg ratio for this industry is 2.",
                recommendation: "The company is ok valued.",
                help: "The price/earnings to growth ratio (PEG ratio) is a stock's price-to-earnings (P/E) ratio divided by the growth rate of its earnings for a specified time period. The PEG ratio is used to determine a stock's value while also factoring in the company's expected earnings growth, and it is thought to provide a more complete picture than the more standard P/E ratio.\n This is an indicator of potential value.",
                mood: true,
            },
            {
                key: "short_ratio",
                value: "1.68",
                title: "Short ratio",
                comparison: "The average peg ratio for this industry is 2.",
                recommendation: "First quarter reveneue rose 20%. This is a long recommendation ok boss do not go crazy because of it.",
                help: "The short ratio is a widely-used tool by short selling hedge funds and other portfolio managers in the stock market. The short ratio indicates the number of shares that investors sell short over the average daily volume of the stock on the basis of 1 or 3 months.",
                mood: false,
            },
            {
                key: "eps",
                value: "1.68",
                title: "Earnings per share",
                comparison: "The average peg ratio for this industry is 2.",
                recommendation: "First quarter reveneue rose 20%. This is a long recommendation ok boss do not go crazy because of it.",
                help: "The short ratio is a widely-used tool by short selling hedge funds and other portfolio managers in the stock market. The short ratio indicates the number of shares that investors sell short over the average daily volume of the stock on the basis of 1 or 3 months.",
                mood: false,
            },
            {
                key: "recommendation",
                value: "Buy",
                title: "Recommendation",
                comparison: "",
                recommendation: "Analyst recommends to buy",
                help: "Represents an analyst recommendation. Please note this doesn't reflect yld0 opinion and merely a guide to help inform your decision.",
                mood: true,
                moodText: "Buy",
            },
            {
                key: "morningstar_recommendation",
                value: "Buy",
                title: "Morning Star Recommendation",
                comparison: "",
                recommendation: "Analyst recommends to buy",
                help: "Represents an analyst recommendation. Please note this doesn't reflect yld0 opinion and merely a guide to help inform your decision.",
                mood: true,
                moodText: "Buy",
            },

            /* Need to fix */
            {
                key: ",ea",
                value: "$20",
                title: "Target Mean (Mean)",
                comparison: "",
                recommendation: "",
                help: "The short ratio is a widely-used tool by short selling hedge funds and other portfolio managers in the stock market. The short ratio indicates the number of shares that investors sell short over the average daily volume of the stock on the basis of 1 or 3 months.",
                mood: false,
            },
            {
                key: ",ea",
                value: "$20",
                title: "Target Mean (Median)",
                comparison: "",
                recommendation: "",
                help: "The short ratio is a widely-used tool by short selling hedge funds and other portfolio managers in the stock market. The short ratio indicates the number of shares that investors sell short over the average daily volume of the stock on the basis of 1 or 3 months.",
                mood: false,
            },
            {
                key: ",ea",
                value: "$20",
                title: "Target Mean (High)",
                comparison: "",
                recommendation: "",
                help: "The short ratio is a widely-used tool by short selling hedge funds and other portfolio managers in the stock market. The short ratio indicates the number of shares that investors sell short over the average daily volume of the stock on the basis of 1 or 3 months.",
                mood: false,
            },
            {
                key: ",ea",
                value: "$20",
                title: "Target Mean (Low)",
                comparison: "",
                recommendation: "",
                help: "The short ratio is a widely-used tool by short selling hedge funds and other portfolio managers in the stock market. The short ratio indicates the number of shares that investors sell short over the average daily volume of the stock on the basis of 1 or 3 months.",
                mood: false,
            },
        ];
        this.items = items;
    }

    private showDialog(_: Event, item: StockInsightItem) {
        this.dialogOpened = true;
        this.dialogItem = item;
    }

    private generateMoodText(mood: Boolean, moodText: String) {
        var output = "";
        if (moodText === "" || moodText === undefined) {
            output = mood ? "Positive" : "Red Flag";
        } else {
            output = moodText;
        }

        return html`${output}`;
    }

    private tableHeaderRenderer = () => {
        return html`
            <tr>
                <th></th>
                <th></th>
                <!-- <th></th> -->
            </tr>
        `;
    };

    private trRenderer = (item: StockInsightItem, index: Number) => {
        return html`
            <tr role="row" index="${index}">
                <td style="width: 65%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-vertical-layout id="vert-${item.uuid}" style="line-height: var(--lumo-line-height-m);" @swipe=${this.handleDrag}>
                            <span>
                                ${item.title}
                                <span style="color: var(--lumo-secondary-text-color);">${item.value}</span>
                                <span style="font-size: var(--lumo-font-size-xxs)" theme="badge contrast" @click="${(e) => this.showDialog(e, item)}">
                                    <span>info</span>
                                </span>
                            </span>
                            <span style="font-size: var(--lumo-font-size-xxs);">${item.comparison}</span>
                            <span style="font-size: var(--lumo-font-size-xxs); color: var(--lumo-secondary-text-color);">${item.recommendation}</span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing"> </vaadin-horizontal-layout>
                </td>
                <td style="width: 8%;">
                    <vaadin-horizontal-layout>
                        <vaadin-vertical-layout>
                            <span style="font-size: var(--lumo-font-size-xxs);" theme="badge ${item.mood ? "success" : "error"}">${this.generateMoodText(item.mood, item.moodText)}</span>
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
                <table class="yld0">
                    <!-- header -->
                    ${this.tableHeaderRenderer()}
                    <!-- data -->
                    ${this.items?.map((i, index) => this.trRenderer(i, index))}
                </table>
            </section>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- modal -->
            <vaadin-dialog
                aria-label="Help Info"
                .opened="${this.dialogOpened}"
                @opened-changed="${(e: CustomEvent) => (this.dialogOpened = e.detail.value)}"
                .renderer="${guard([], () => (root: HTMLElement) => {
                    render(
                        html`
                            <vaadin-vertical-layout theme="spacing" style="width: 300px; max-width: 100%; align-items: stretch;">
                                <h2 style="margin: var(--lumo-space-m) 0; font-size: 1.5em; font-weight: bold;">${this.dialogItem?.title}</h2>
                                <p style="font-size: var(--lumo-font-size-xxs);" label="Description">${this.dialogItem?.help}</p>
                                <vaadin-button @click="${() => (this.dialogOpened = false)}" style="align-self: flex-end;"> Close </vaadin-button>
                            </vaadin-vertical-layout>
                        `,
                        root
                    );
                })}"
            ></vaadin-dialog>
        `;
    }
}

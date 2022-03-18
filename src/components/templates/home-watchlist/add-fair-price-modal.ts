/* Full Page Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-area";
import "@vaadin/number-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import ApexCharts from "apexcharts/dist/apexcharts.esm.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
//import { transparentize, colour } from "../../helpers/utilities/chart_helpers.js";

import "../../_generic/alerts";

@customElement("add-fair-price-modal")
class AddFairPriceModal extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    stock: Object;

    @query(".barChart")
    chart!: HTMLElement;

    @query("generic-alert")
    help!: HTMLElement;

    @state()
    data: Array;

    @state()
    barChart: Object;

    @state()
    priceMeta: String = "";

    @state()
    priceMetaClass: String = ""; // css class for price meta

    @state()
    isMobile: Boolean = false;

    // -- End of state etc -- //

    // -- Styles -- //
    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            section {
                padding-bottom: 2rem;
                margin-bottom: 3rem;
            }

            .help {
                margin-left: auto;
            }

            vaadin-number-field {
                margin: 1.2em;
            }

            vaadin-text-area {
                margin: 1.2em;
            }

            span#priceInfo {
                position: relative;
                top: 85px;
            }

            .over {
                color: var(--lumo-success-color);
            }

            .under {
                color: var(--lumo-error-color);
            }

            .overprice {
                border-radius: 50%;
                transform: rotate(-135deg);
                background-color: #ecf9f2;
                color: var(--lumo-success-color);
            }

            .underprice {
                border-radius: 50%;
                transform: rotate(45deg);
                background-color: #ffe6e8;
                color: var(--lumo-error-color);
            }

            vaadin-number-field {
                caret-color: var(--lumo-primary-color-50pct);
            }
            vaadin-number-field input[type="number"] {
                padding-left: 1em;
                color: var(--lumo-primary-color-50pct);
                background-color: var(--lumo-base-color);
            }

            vaadin-number-field vaadin-input-container {
                background-color: var(--lumo-base-color);
            }

            vaadin-text-area {
                border-top-color: var(--lumo-tint-5pct);
                border-bottom-color: var(--lumo-tint-5pct);
                border-right-color: var(--lumo-tint-5pct);
                border-left-color: var(--lumo-tint-5pct);
                background-color: var(--lumo-tint-5pct);
                opacity: 0.7;
            }

            textarea {
                border-top-color: var(--lumo-tint-5pct);
                border-bottom-color: var(--lumo-tint-5pct);
                border-right-color: var(--lumo-tint-5pct);
                border-left-color: var(--lumo-tint-5pct);
                background-color: var(--lumo-tint-5pct);
                opacity: 0.7;
            }

            #save {
                float: right;
            }

            /* Styling for number input */
            [part="helper-text"] {
                display: block;
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-xs);
                line-height: var(--lumo-line-height-xs);
                margin-left: calc(var(--lumo-border-radius-m) / 4);
                transition: color 0.2s;
            }

            input[type="number"] {
                display: flex;
                padding-left: 1em;
                color: var(--lumo-primary-color-50pct);
                background-color: var(--lumo-base-color);
                height: 77.0312px;
                margin-bottom: 19.2px;
                margin-left: 19.2px;
                margin-right: 19.2px;
                margin-top: 19.2px;
                outline-color: rgba(24, 39, 57, 0.94);
                outline-style: none;
                outline-width: 0px;
                padding-bottom: 4px;
                padding-left: 16px;
                padding-right: 16px;
                padding-top: 16px;
            }

            [part="label"] {
                align-self: flex-start;
                color: var(--lumo-secondary-text-color);
                font-weight: 500;
                font-size: var(--lumo-font-size-s);
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
            }

            /* End of the number input */
        `,
    ];

    // -- Lifecyle Functions -- //
    async firstUpdated() {
        this.initialiseBarGraph();
    }

    update(changedProperties: PropertyValues) {
        this.checkIsMobile();
        super.update(changedProperties);
    }

    private checkIsMobile() {
        this.isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

        // if (this.isMobile) {
        //     //Conditional script here
        //     console.log("Danvir this is a mobile! ");
        // } else {
        //     console.log("Danvir not a mobile");
        // }
    }

    // -- Initialise graph -- //
    private initialiseBarGraph() {
        // Calculate categories

        let categories;
        let annotations_yaxis = [
            {
                y: this.stock.price_number,
                borderColor: "black",
                label: {
                    borderColor: "black",
                    style: {
                        color: "#fff",
                        background: "black",
                    },
                    text: "current price",
                },
            },
        ];

        // For mobile we only want to show one analyst value because of limited space
        let targets;
        let targets_categories;
        if (this.isMobile) {
            targets = [this.stock.target_mean_price];
            targets_categories = [["Analyst", "Mean Estimate"]];
        } else {
            targets = [this.stock.target_low_price, this.stock.target_mean_price, this.stock.target_high_price];
            targets_categories = [
                ["Analyst", "Low Estimate"],
                ["Analyst", "Mean Estimate"],
                ["Analyst", "High Estimate"],
            ];
        }

        if (this.stock.dcf) {
            categories = [["Your", "valuation"], ["Discounted", "Cash Flow"], ...targets_categories];
            this.data = [this.stock.price_number, this.stock.dcf, ...targets];
            annotations_yaxis.push({
                y: this.stock.dcf * 0.8,
                borderColor: "green",
                label: {
                    borderColor: "black",
                    style: {
                        color: "#fff",
                        background: "black",
                    },
                    text: "20% below DCF",
                },
            });
        } else {
            categories = [["Your", "valuation"], ...targets_categories];
            this.data = [this.stock.price_number, ...targets];
        }

        var options = {
            colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
            series: [
                {
                    name: "Price",
                    data: this.data,
                },
            ],
            tooltip: {
                enabled: true,
                x: {
                    show: false,
                },
                y: {
                    show: false,
                },
            },
            chart: {
                fontFamily: "IBM Plex Sans, sans-serif",
                foreColor: "#1a2a40",
                height: 360,
                type: "bar",

                toolbar: {
                    show: !this.isMobile,
                },
            },
            grid: {
                show: false,
            },
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    columnWidth: "93%",
                    dataLabels: {
                        position: "top", // top, center, bottom
                    },
                    distributed: true,
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => {
                    return `${this.stock.currency_symbol}` + val;
                },

                // function (val) {
                //     return "${this.stock.currency_symbol}" + val;
                // },
                offsetY: -20,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"],
                },
            },
            xaxis: {
                categories: categories,
                position: "bottom",
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                        type: "gradient",
                        gradient: {
                            colorFrom: "#D8E3F0",
                            colorTo: "#BED1E6",
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                },
                tooltip: {
                    enabled: false,
                },
                labels: {
                    show: true,
                    style: {
                        fontSize: "10px",
                        // fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold",
                        //colors: "black",
                    },
                },
            },
            yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
                labels: {
                    show: false,
                    // formatter: function (val) {
                    //     return "$" + val;
                    // },
                },
            },
            title: {
                text: undefined,
                floating: true,
                offsetY: 0,
                align: "center",
                style: {
                    color: "#444",
                },
            },
            annotations: {
                yaxis: annotations_yaxis,
            },
        };
        this.barChart = new ApexCharts(this.chart, options);
        this.barChart.render();
    }

    // -- Utility functions -- //
    private updatePriceMeta(price: Float) {
        let percent;

        if (price > this.stock.price_number) {
            percent = ((price / this.stock.price_number) * 100 - 100).toFixed(2);
            this.priceMetaClass = "over";
        } else if (price < this.stock.price_number) {
            percent = ((this.stock.price_number / price) * 100 - 100).toFixed(2);
            this.priceMetaClass = "under";
        }

        if (percent == "Infinity") {
            this.priceMeta = "";
        } else {
            this.priceMeta = `${percent}%`;
        }
    }

    // -- Handle Actions -- //

    // Save the valuation via graphql mutation
    private handleSaveValuation() {}

    private handleUpdateValuation(e: Event) {
        console.log(e.srcElement.value, typeof e);

        if (isNaN(e.srcElement.value)) {
            console.log("not a number");
            return;
        }

        this.updatePriceMeta(e.srcElement.value);

        this.data[0] = e.srcElement.value;
        this.barChart.updateSeries([
            {
                data: this.data,
            },
        ]);
    }

    // -- Other Renders -- //

    // -- Main render -- //
    render() {
        return html`
            <link rel="stylesheet" href="/node_modules/apexcharts/dist/apexcharts.css" />
            <section>
                <vaadin-horizontal-layout style="align-this.items: center;" theme="spacing">
                    <vaadin-avatar theme="xlarge" img="${this.stock?.logo_url}" name="${this.stock.symbol}" theme="xsmall"></vaadin-avatar>
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <span class="stockSymbol">${this.stock.symbol} </span>
                        <span class="companyName">${this.stock.company_name}</span>
                    </vaadin-vertical-layout>
                    <div class="help">
                        <vaadin-button
                            @click="${() => {
                                this.help._wrapper.classList.remove("closed");
                            }}"
                            theme="icon"
                            aria-label="Show help"
                        >
                            <vaadin-icon icon="vaadin:question-circle"></vaadin-icon>
                        </vaadin-button>
                    </div>
                </vaadin-horizontal-layout>

                <generic-alert title="Add a valuation" description="Specify what you believe to be the fair price for ${this.stock.company_name}.">
                    <p style="font-size: var(--lumo-font-size-tiny);">Analyst estimations and the Discounted Cash Flow have been provided to you as a guide.</p>
                </generic-alert>

                <!-- Bar Chart -->
                <div style="padding: 0.3rem; margin-bottom: 5rem;">
                    <div class="barChart"></div>
                    <generic-alert theme="info" title="Need help with your valuation" description="">
                        Click <a href="/adada">here</a> for more information
                        <p><a href="/" style="font-size: var(--lumo-font-size-tiny);">How is Discount free cash flow is calculated?</a></p> </generic-alert
                    >
                    
                        <vaadin-horizontal-layout style="align-this.items: center; width:100%;" ">
                            <span>
                                <div slot="helper" id="helper-vaadin-number-field-0">This could be the value you would like to buy the stock at.</div>
                                <input slot="input" value="1049.61" type="number" id="vaadin-number-field-1" placeholder="1049.61" aria-labelledby="label-vaadin-number-field-1" aria-describedby="helper-vaadin-number-field-0" min="undefined" max="undefined" step="any">
                                <label slot="label" id="label-vaadin-number-field-1" for="vaadin-number-field-1">Your valuation</label>
                            </span>
<vaadin-number-field
value="${this.stock.price_number}"
label="Your valuation"
helper-text="This could be the value you would like to buy the stock at."
theme="helper-above-field"
style="width: 50%; padding-right: 1em; padding-left: 1em;"
placeholder=${this.stock.price_number}
@keyup=${this.handleUpdateValuation}
><div slot="prefix">${this.stock.currency_symbol}</div>
</vaadin-number-field>

                            <span id="priceInfo" class="${this.priceMetaClass}">

                                ${
                                    this.priceMeta
                                        ? html`
                                              <vaadin-icon class=${this.priceMetaClass == "over" ? "overprice" : "underprice"} icon="lumo:arrow-down"></vaadin-icon>
                                              ${this.priceMeta}
                                              <span style="color: var(--lumo-secondary-text-color);font-size: var(--lumo-font-size-tiny);"
                                                  >${this.priceMetaClass == "over" ? "over the current price" : "under the current price"}</span
                                              >
                                          `
                                        : html``
                                }
                            </span>
                        </vaadin-horizontal-layout>

                        <vaadin-text-area
                            title="Notes"
                            label="Notes (Highly Recommended)"
                            theme="helper-above-field"
                            helper-text="Why valuate @ this price. Over a prolonged time you can look at how accurate your valuations were."
                            maxlength="500"
                            style="width: 80%; height: 150px; padding-left: 1em; padding-right: 1em; "
                        >
                        </vaadin-text-area>

                        <div style="padding-right: 10em;">
                              <vaadin-button id="save" style="margin-left: auto; margin-right: auto;"@click="${this.handleSaveValuation}" theme="primary contrast large">Save valuation</vaadin-button>
                        </div>
                    
                </div>
            </section>
        `;
    }
}

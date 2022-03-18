import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import ApexCharts from "apexcharts/dist/apexcharts.esm.js";
import { createChart, LineStyle } from "lightweight-charts";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import "@vaadin/button";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../../themes/yld0-theme/styles.js";
import { urlForName } from "../../../../router/index.js";

@customElement("alert-detail")
class AlertDetailElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    stock: Object;

    @property()
    alert: Object;

    @query(".Chart")
    chartQuerySelector!: HTMLElement;

    @state()
    chart: Object;

    @state()
    lineSeries: Object;

    annotations: [Object] = [];

    pls: [Object] = [];

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        //themeStyles,
        css`
            vaadin-button {
                cursor: pointer;
            }

            .Chart {
                position: relative;
                margin-top: 1.5rem;
            }
        `,
    ];

    // -- Lifecycle function -- //

    private firstUpdated() {
        console.log("firstUpdated");
        this.createLWChart();
    }

    createLWChart() {
        // Currency support for dollar / pound
        var formatters = {
            Dollar: function (price) {
                const priceVal = typeof price === "string" ? price : price.toFixed(2);
                return "$" + priceVal;
            },
            Pound: function (price) {
                const priceVal = typeof price === "string" ? price : price.toFixed(2);
                return "\u00A3" + priceVal;
            },
        };

        const formatterKeys = Object.keys(formatters);

        this.chart = createChart(this.chartQuerySelector, {
            width: 400,
            height: 150,
            layout: {
                fontFamily: "IBM Plex Sans",
            },
            localization: {
                priceFormatter: formatters["Dollar"],
            },
            rightPriceScale: {
                visible: false,
            },
            leftPriceScale: {
                visible: true,
                borderColor: "rgba(197, 203, 206, 1)",
            },
            timeScale: {
                visible: true,
            },
            crosshair: {
                horzLine: {
                    visible: false,
                },
                vertLine: {
                    visible: false,
                },
            },

            grid: {
                horzLines: {
                    color: "#eee",
                    visible: true,
                },
                vertLines: {
                    color: "#fff",
                },
            },
        });

        this.lineSeries = this.chart.addLineSeries();

        let historical_prices_1yr = [];
        Array.from(this.stock?.historical_prices_1yr).forEach((hp: Object, i) => {
            historical_prices_1yr.push({
                time: hp.date, //new Date(hp.date).getTime(),
                value: hp.close,
            });
        });

        this.lineSeries.setData(historical_prices_1yr);

        this.updateChartMarkers();
    }

    update(changedProperties: PropertyValues) {
        console.log("danvir, update", this.alert);

        if (this.chartQuerySelector !== null) {
            if (["EARNINGS", "TIME_REVIEW"].includes(this.alert.alert_type)) {
                this.chartQuerySelector.style.display = "none";
            } else {
                console.log(this.chartQuerySelector);
                this.chartQuerySelector.style.display = "block";
                this.updateChartMarkers();
            }
        }
        super.update(changedProperties);
    }

    // -- Other functions -- //

    private updateChartMarkers() {
        if (this.chart !== undefined && this.lineSeries !== undefined) {
            Array.from(this.pls).forEach((pl: Object, i) => {
                this.lineSeries.removePriceLine(pl);
            });

            let annotations = [];
            if (this.alert?.graph_annotations) {
                Array.from(this.alert?.graph_annotations).forEach((ga: Object, i) => {
                    if (ga?.name == "target") {
                        annotations.push({
                            price: ga.value,
                            color: "#be1238",
                            lineWidth: 1,
                            lineStyle: LineStyle.Solid,
                            axisLabelVisible: true,
                            title: ga.name,
                        });
                    }
                });
            }

            var markers = [{ time: this.alert.created_at, position: "aboveBar", color: "black", shape: "arrowDown", text: "Alert Created @" }];
            this.lineSeries.setMarkers(markers);
            this.annotations = annotations;

            this.pls = [];
            Array.from(annotations).forEach((pl: Object, i) => {
                const priceLine = this.lineSeries.createPriceLine(pl);
                this.pls.push(priceLine);
            });
        }
    }

    // -- Other Functions -- //

    private handleClose() {
        var event = new CustomEvent("close", { detail: { alert: this.alert } });
        this.dispatchEvent(event);
    }

    private handleSave() {
        var event = new CustomEvent("save", { detail: { alert: this.alert } });
        this.dispatchEvent(event);
    }

    // -- Main Render -- //
    render() {
        const notItems = [
            { id: "EMAIL_NOTIFICATION", label: "Email", selected: this.alert.notification_types.includes("EMAIL_NOTIFICATION") },
            { id: "PUSH_NOTIFICATION", label: "Push", selected: this.alert.notification_types.includes("PUSH_NOTIFICATION") },
        ];

        const repItems = [
            { id: "ONE_OFF", label: "One-off", selected: !this.alert.repeated },
            { id: "REPEATED", label: "Repeated", selected: this.alert.repeated },
        ];

        return html`
            <vaadin-horizontal-layout>
                <vaadin-vertical-layout>
                    <span class="description"> ${this.stock.symbol}</span>
                    <span class="description" style="font-size: var(--lumo-font-size-micro)"> ${this.stock.company_name}</span>
                    <!-- <span class="priceBold"> ${this.stock.price}</span> -->
                </vaadin-vertical-layout>
            </vaadin-horizontal-layout>

            <div class="Chart"></div>

            <vaadin-vertical-layout theme="spacing" style="max-width: 400px; align-items: stretch;">
                <h3 style="margin: var(--lumo-space-m) 0; font-weight: bold;">${this.alert?.title}</h3>
                <p style="font-size: var(--lumo-font-size-xxs);" label="Description">${this.alert?.description}</p>

                ${["EARNINGS", "TIME_REVIEW"].includes(this.alert.alert_type)
                    ? html`
                          <toggle-group
                              label="Alert Type"
                              .items=${repItems}
                              @selected-change=${(e) => {
                                  var item = { ...this.alert };
                                  item.repeated = e.detail.value == "REPEATED" ? true : false;
                                  this.alert = item;
                              }}
                          >
                              <div slot="help">
                                  <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                                  <p>Repeating Alert: Sends one alert and then resets the alert so it can be triggered again based off current values.</p>
                              </div>
                          </toggle-group>
                      `
                    : html``}
            </vaadin-vertical-layout>

            <toggle-group
                label="Notification Channels"
                @selected-change=${(e) => {
                    var item = { ...this.alert };
                    item.notification_types = e.detail.value;
                    this.alert = item;
                }}
                .items=${notItems}
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
            <text-area
                label="Notes"
                @on-change=${(e) => {
                    var item = { ...this.alert };
                    item.notes = e.detail.value;
                    this.alert = item;
                }}
                value=${this.alert?.notes}
            ></text-area>
            <footer style="padding: var(--lumo-space-s) var(--lumo-space-m); text-align: right;">
                <vaadin-button theme="tertiary" style="margin-inline-end: var(--lumo-space-m);" @click="${this.handleClose}">Cancel</vaadin-button>
                <vaadin-button theme="primary contrast" @click="${this.handleSave}"> Save </vaadin-button>
            </footer>
        `;
    }
}

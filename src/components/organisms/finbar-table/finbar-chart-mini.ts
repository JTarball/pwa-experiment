import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import { createChart, isBusinessDay } from "lightweight-charts";

import ApexCharts from "apexcharts/dist/apexcharts.esm.js";

// To protect the css from the leightweight chart, we need to
// wrap it in a web component
@customElement("finbar-chart-mini")
export class FinBarChartMini extends LitElement {
    // -- Start of state, properties, queries -- //

    @query(".Chart")
    chartQuerySelector!: HTMLElement;

    @state()
    chart: Object;

    @property({ type: Array })
    dataset = [];

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            .Chart {
                margin: 0rem;
                padding: 0rem;
            }
        `,
    ];

    // -- Lifecycle function -- //
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
        this.createChart();
    }

    createChart() {
        // Calculate categories

        //let categories;
        // let annotations_yaxis = [
        //     {
        //         y: this.stock.price_number,
        //         borderColor: "black",
        //         label: {
        //             borderColor: "black",
        //             style: {
        //                 color: "#fff",
        //                 background: "black",
        //             },
        //             text: "current price",
        //         },
        //     },
        // ];

        // For mobile we only want to show one analyst value because of limited space
        // let targets;
        // let targets_categories;
        // if (this.isMobile) {
        //     targets = [this.stock.target_mean_price];
        //     targets_categories = [["Analyst", "Mean Estimate"]];
        // } else {
        //     targets = [this.stock.target_low_price, this.stock.target_mean_price, this.stock.target_high_price];
        //     targets_categories = [
        //         ["Analyst", "Low Estimate"],
        //         ["Analyst", "Mean Estimate"],
        //         ["Analyst", "High Estimate"],
        //     ];
        // }

        // if (this.stock.dcf) {
        //     categories = [["Your", "valuation"], ["Discounted", "Cash Flow"], ...targets_categories];
        //     this.data = [this.stock.price_number, this.stock.dcf, ...targets];
        //     annotations_yaxis.push({
        //         y: this.stock.dcf * 0.8,
        //         borderColor: "green",
        //         label: {
        //             borderColor: "black",
        //             style: {
        //                 color: "#fff",
        //                 background: "black",
        //             },
        //             text: "20% below DCF",
        //         },
        //     });
        // } else {
        //     categories = [["Your", "valuation"], ...targets_categories];
        //     this.data = [this.stock.price_number, ...targets];
        // }

        if (this.dataset) {
            const values = [];
            const times = [];
            const tsdatas = [];
            Array.from(this.dataset).forEach((tsdata, i) => {
                if (tsdata.value) {
                    times.push(tsdata.time);
                    values.push(tsdata.value);
                    tsdatas.push({ x: tsdata.time, y: tsdata.value });
                }
            });

            console.log("tsdatas", tsdatas);

            var options = {
                colors: ["#FFBC0A"],
                series: [
                    {
                        name: "Price",
                        data: tsdatas,
                    },
                ],
                tooltip: {
                    enabled: false,
                },
                chart: {
                    animations: {
                        enabled: true,
                    },
                    fontFamily: "IBM Plex Sans, sans-serif",
                    foreColor: "#1a2a40",
                    height: 70,
                    width: 150,
                    type: "bar",
                    toolbar: {
                        show: false,
                        tools: {
                            download: false,
                            selection: false,
                            zoom: false,
                            zoomin: false,
                            zoomout: false,
                            pan: false,
                            reset: false,
                            customIcons: [],
                        },
                    },
                },
                grid: {
                    show: false,
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    },
                },
                legend: {
                    show: false,
                    itemMargin: {
                        horizontal: 0,
                        vertical: 0,
                    },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 0,
                        columnWidth: "90%",
                        dataLabels: {
                            enabled: false,
                            position: "top", // top, center, bottom
                        },
                        distributed: true,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    type: "datetime",
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
                    },
                },
                yaxis: {
                    // min: 0,
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
                    },
                },
                title: {
                    text: undefined,
                    floating: false,
                    offsetY: 0,
                    align: "center",
                    style: {
                        color: "#444",
                    },
                },
            };
            this.barChart = new ApexCharts(this.chartQuerySelector, options);
            this.barChart.render();
        }
    }

    // -- Main Render -- //
    render() {
        return html` <div class="Chart"></div> `;
    }
}

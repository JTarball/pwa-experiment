import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import { createChart, isBusinessDay } from "lightweight-charts";

import ApexCharts from "apexcharts/dist/apexcharts.esm.js";

// To protect the css from the leightweight chart, we need to
// wrap it in a web component
@customElement("finbar-chart-apex")
export class FinBarChartApex extends LitElement {
    // -- Start of state, properties, queries -- //

    @query(".Chart")
    chartQuerySelector!: HTMLElement;

    @state()
    barChart: Object;

    @property({ type: Array })
    dataset = [];

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            .Chart {
                margin: 1rem;
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
        const data = this.dataset || [];

        const values = [];
        const times = [];
        const tsdatas = [];
        Array.from(data).forEach((tsdata, i) => {
            if (tsdata.value) {
                times.push(tsdata.time);
                values.push(tsdata.value);
                tsdatas.push({ x: tsdata.time, y: tsdata.value });
            }
        });

        var options = {
            colors: ["black"],
            series: [
                {
                    name: "Price",
                    data: tsdatas,
                },
            ],
            tooltip: {
                enabled: false,
                style: {
                    fontSize: "20px",
                    fontFamily: "Roboto",
                },
                x: {
                    show: true,
                    format: "HH:mm",
                },
                y: {
                    formatter: (value) => `${value}%`,
                },
                marker: {
                    show: true,
                },
                theme: "dark",
            },
            chart: {
                fontFamily: "IBM Plex Sans, sans-serif",
                foreColor: "#1a2a40",
                height: 300,
                type: "bar",
                toolbar: {
                    show: false,
                    offsetX: 0,
                    offsetY: 0,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true | '<img src="/static/icons/reset.png" width="20">',
                        customIcons: [],
                    },
                    export: {
                        csv: {
                            filename: undefined,
                            columnDelimiter: ",",
                            headerCategory: "category",
                            headerValue: "value",
                            dateFormatter(timestamp) {
                                return new Date(timestamp).toDateString();
                            },
                        },
                        svg: {
                            filename: undefined,
                        },
                        png: {
                            filename: undefined,
                        },
                    },
                    autoSelected: "zoom",
                },
                // toolbar: {
                //     show: !this.isMobile,
                // },
            },
            grid: {
                show: true,
            },
            legend: {
                show: false,
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
                // formatter: (val) => {
                //     return `${this.stock.currency_symbol}` + val;
                // },

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
                type: "datetime",
            },
            yaxis: {
                min: 0,
                tickAmount: 5,
                axisBorder: {
                    show: true,
                },
                axisTicks: {
                    show: true,
                },
                tooltip: {
                    enabled: true,
                },
                labels: {
                    show: true,
                    formatter: function (val) {
                        return val.toFixed(2) + "%";
                    },
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
            // annotations: {
            //     yaxis: annotations_yaxis,
            // },
        };
        this.barChart = new ApexCharts(this.chartQuerySelector, options);
        this.barChart.render();
    }

    update(changedProperties: PropertyValues) {
        console.log("update", this.barChart);
        if (this.dataset && this.barChart) {
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

            this.barChart.updateSeries([
                {
                    data: tsdatas,
                },
            ]);
        }
        super.update(changedProperties);
    }

    // -- Main Render -- //z
    render() {
        return html` <div class="Chart"></div> `;
    }
}

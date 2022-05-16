import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { GetBoughtSoldInsiderShares } from "../../../graphql/queries/GetBoughtSoldInsiderShares.query.graphql";
import ApexCharts from "apexcharts/dist/apexcharts.esm.js";

// To protect the css from the leightweight chart, we need to
// wrap it in a web component
@customElement("insider-trading-chart-mini")
export class InsiderTradingChartMini extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: String })
    symbol?: string;

    query = new ApolloQueryController(this, GetBoughtSoldInsiderShares, {
        fetchPolicy: "cache-and-network",
        noAutoSubscribe: true,
    });

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
        if (this.symbol) {
            this.query.variables = { symbol: this.symbol };
            this.query.subscribe();
            this.query.refetch();
        }

        this.createChart();
    }

    createChart() {
        const values = [];
        const times = [];
        const tsdatas = [];

        if (this.query?.data?.bought_sold_insider) {
            for (const [key, value] of Object.entries(this.query?.data?.bought_sold_insider)) {
                console.log("bought_sold___", key, value);
            }
        }

        // Array.from(this.query?.data?.bought_sold_insider).forEach((tsdata, i) => {
        //     console.log(tsdata, "ahjkdhjksakdhsakhdkjas", "bought_sold");
        //     // if (tsdata.value) {
        //     //     times.push(tsdata.time);
        //     //     values.push(tsdata.value);
        //     //     tsdatas.push({ x: tsdata.time, y: tsdata.value });
        //     // }
        // });

        // console.log("tsdatas", tsdatas);

        var options = {
            colors: ["#109648", "#FFBC0A"],
            series: [
                {
                    name: "Shares Bought",
                    data: [44],
                },
                {
                    name: "Shares Sold",
                    data: [53],
                },
            ],
            chart: {
                type: "bar",
                width: 200,
                height: 70,
                stacked: true,
                stackType: "100%",
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
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
            dataLabels: {
                enabled: true,
                textAnchor: "middle",
                style: {
                    fontSize: "10px",
                    fontFamily: "monospace",
                    // colors: ["#1b2b41"],
                    // fontWeight: "bold",
                    // colors: "#fff",
                },
                background: {
                    enabled: false,
                },
                formatter: function (val, opt) {
                    return Math.round(val) + "%";
                    console.log(val, opt, "INSIDER");
                    if (val < 15 || val > 85) {
                        return Math.round(val) + "%";
                    } else {
                        return Math.round(val) + "% " + opt.w.globals.seriesNames[opt.seriesIndex];
                    }
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false,
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            title: {
                text: undefined,
            },
            xaxis: {
                // categories: ["Past Month", "Past 3 Months", "Past 6 Months", "Past Year", "Past 18 Months"],

                labels: {
                    show: false,
                },
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
            tooltip: {
                enabled: false,
            },
            fill: {
                opacity: 1,
            },
            legend: {
                show: false,
                itemMargin: {
                    horizontal: 0,
                    vertical: 0,
                },
            },

            // subtitle: {
            //     text: "Bought vs Sold Shares",
            //     align: "center",
            //     margin: 10,
            //     offsetX: 0,
            //     offsetY: 0,
            //     floating: false,
            //     style: {
            //         fontSize: "12px",
            //         fontWeight: "normal",
            //         color: "#9699a2",
            //     },
            // },
        };
        this.barChart = new ApexCharts(this.chartQuerySelector, options);
        this.barChart.render();
    }

    // -- Main Render -- //
    render() {
        const { data, options, loading, error, errors, networkStatus } = this.query;

        console.log("bought_sold", data, error, errors);

        if (this.query?.data?.bought_sold_insider && this.barChart) {
            const tsdatas_bought = [];
            const tsdatas_sold = [];

            // {
            //     name: "Shares Bought",
            //     data: [44, 55, 41, 37, 122],
            // },
            // {
            //     name: "Shares Sold",
            //     data: [53, 32, 33, 52, 13],
            // },

            for (const [_, val] of Object.entries(this.query?.data?.bought_sold_insider)) {
                for (const [key, value] of Object.entries(val)) {
                    console.log("bought_sold___", key, value);
                    if (key == "buys_shares") {
                        if (value) {
                            tsdatas_bought.push(value);
                        } else {
                            tsdatas_bought.push(null);
                        }
                    } else if (key == "sells_shares") {
                        if (value) {
                            tsdatas_sold.push(value);
                        } else {
                            tsdatas_sold.push(null);
                        }
                    }
                }
            }

            console.log("bought_sold__", tsdatas_bought, tsdatas_sold);

            // this.barChart.updateSeries([
            //     {
            //         name: "Shares Bought",
            //         data: tsdatas_bought,
            //     },
            //     {
            //         name: "Shares Sold",
            //         data: tsdatas_sold,
            //     },
            // ]);
        }

        return html` <div class="Chart"></div> `;
    }
}

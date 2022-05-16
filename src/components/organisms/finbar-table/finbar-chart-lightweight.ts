import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import { createChart, isBusinessDay } from "lightweight-charts";

// To protect the css from the leightweight chart, we need to
// wrap it in a web component
@customElement("finbar-chart-lightweight")
export class FinBarChart extends LitElement {
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
                margin: 1rem;
            }
        `,
    ];

    // -- Lifecycle function -- //
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
        this.createLWChart();
    }

    createLWChart() {
        // Currency support for dollar / pound
        // var formatters = {
        //     Dollar: function (price) {
        //         const priceVal = typeof price === "string" ? price : price.toFixed(2);
        //         return "$" + priceVal;
        //     },
        //     Pound: function (price) {
        //         const priceVal = typeof price === "string" ? price : price.toFixed(2);
        //         return "\u00A3" + priceVal;
        //     },
        // };

        // const formatterKeys = Object.keys(formatters);

        var width = 500;
        var height = 300;

        const chart = createChart(this.chartQuerySelector, {
            width: width,
            height: height,
            layout: {
                fontFamily: "IBM Plex Sans",
            },
            // localization: {
            //     priceFormatter: formatters["Dollar"],
            // },
            rightPriceScale: {
                visible: true,
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.25,
                },
                borderVisible: true,
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
                    visible: true,
                },
                vertLine: {
                    visible: true,
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

        const barSeries = chart.addHistogramSeries({
            color: "blue",
            priceFormat: {
                type: "volume",
            },
            priceScaleId: "",
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        let historical_prices_1yr = [];
        Array.from(this.dataset).forEach((tsd: Object, i) => {
            console.log("tsds, ", tsd);
            if (tsd.value) {
                historical_prices_1yr.push({
                    time: tsd.time, //new Date(hp.date).getTime(),
                    value: tsd.value,
                });
            }
        });

        console.log("dataset barSeries", historical_prices_1yr);

        if (this.dataset) {
            console.log("lemin", this.dataset);
            barSeries.setData(historical_prices_1yr);
        }

        chart.timeScale().fitContent();

        // this.seriesesData.set("1D", historical_prices_1yr);

        // //this.lineSeries.setData(historical_prices_1yr);

        // //this.updateChartMarkers();

        // this.areaSeries = null;
        // this.syncToInterval(this.intervals[0]);
        var toolTipWidth = 100;
        var toolTipHeight = 80;
        var toolTipMargin = 15;

        var toolTip = document.createElement("div");
        toolTip.className = "floating-tooltip-2";
        this.chartQuerySelector.appendChild(toolTip);

        function businessDayToString(businessDay) {
            return businessDay.year + "-" + businessDay.month + "-" + businessDay.day;
        }

        // update tooltip
        chart.subscribeCrosshairMove(function (param) {
            if (!param.time || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
                toolTip.style.display = "none";
                return;
            }

            var dateStr = isBusinessDay(param.time) ? businessDayToString(param.time) : new Date(param.time * 1000).toLocaleDateString();

            toolTip.style.display = "block";
            var price = param.seriesPrices.get(barSeries);
            toolTip.innerHTML =
                '<div style="color: rgba(255, 70, 70, 1)">Apple Inc.</div>' +
                '<div style="font-size: 24px; margin: 4px 0px">' +
                Math.round(price * 100) / 100 +
                "</div>" +
                "<div>" +
                dateStr +
                "</div>";

            var y = param.point.y;

            var left = param.point.x + toolTipMargin;
            if (left > width - toolTipWidth) {
                left = param.point.x - toolTipMargin - toolTipWidth;
            }

            var top = y + toolTipMargin;
            if (top > height - toolTipHeight) {
                top = y - toolTipHeight - toolTipMargin;
            }

            toolTip.style.left = left + "px";
            toolTip.style.top = top + "px";
        });
    }

    // -- Main Render -- //
    render() {
        return html` <div class="Chart"></div> `;
    }
}

import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { format, isThisSecond } from "date-fns";
import { createChart } from "lightweight-charts";

import "@vaadin/avatar";
import "@vaadin/button";
import "@vaadin/item";
import "@vaadin/list-box";
import "@vaadin/select";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
//import { truncate } from "../../helpers/utilities/helpers.js";

import "../../atoms/toggle-group/toggle-group";
import "./finbar-table-pagination";
import "./finbar-chart-apex";
import "./finbar-chart-mini";

/**
 * FinBarTable
 * A switchable tabular to bar graph table for financial data
 *
 * @param  {string}    title          -  Title for the container
 * @param  {Number}    width          -  Width of the container
 * @param  {Number}    height         -  Height of the container
 * @param  {Array}     headerCells    -  An array of objects describing how to construct the table
 * @param  {Array}     items          -  The raw table data
 * @param  {Number}    rowsPerPage    -  Number of rows per page (has a default)
 *
 *
 * Header Cell Examples
 * e.g. Template
 *
 *  template: (image_url, value) => {
 *    return html`<vaadin-avatar img="${image_url}" name="${value}" theme="xsmall"></vaadin-avatar>${value}`;
 *  },
 *  template_args: {
 *    image_url: "image_url",
 *    value: "name",
 *  },
 *
 */
@customElement("finbar-table")
export class FinBarTable extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: String })
    title = "";

    @property({ type: Number })
    width?;

    @property({ type: Number })
    height?;

    @property({ type: Array })
    headerCells: Array<Object> = [];

    @state()
    items_no_sort = [];

    @property({ type: Number })
    rowsPerPage = 4;

    @state()
    skip = 0; // The skip number, used in pagination

    @state()
    results = [];

    // Financial Bar/Table Options

    @state({ type: Boolean })
    showBar: boolean = false; // if false show tabular data only

    @state({ type: String })
    finPeriod: string = "annual"; // "quarter", "quarterIncTTM", "annualIncTTM"

    @state({ type: Boolean })
    flipTableData: boolean = false; // If true we flip the table data col/rows headers

    @property({ type: Object })
    dataset: object;

    @property({ type: Array })
    items = [];

    // @state()
    // private items_select = [
    //     {
    //         label: "10",
    //         value: "recent",
    //     },
    //     {
    //         label: "20",
    //         value: "rating-desc",
    //     },
    //     {
    //         label: "50",
    //         value: "rating-asc",
    //     },
    //     {
    //         label: "100",
    //         value: "price-desc",
    //     },
    // ];

    @property({ type: Boolean, reflect: true })
    optionalFooter: boolean = false;

    @property({ type: Boolean, reflect: true })
    expanded: boolean = false;

    @property({ type: Boolean, reflect: true })
    overflow: boolean = false;

    @query("div.container")
    container: Element;

    @query(".Chart")
    chartQuerySelector!: HTMLElement;

    @query("#graph")
    graph: Element;

    @state()
    chart: Object;

    @state()
    finMetricKeys = [];

    @state()
    currentDataSet = [];

    @state()
    currentDataSetKey = [];

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .container-wrapper {
                display: inline-block;
                margin: 0.1rem;
                margin-top: 1rem;
            }

            .container {
                min-width: 370px;
                /* min-height: 450px; */
                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);

                display: flex;
                flex-direction: column;

                -webkit-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -moz-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -o-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
            }

            header {
                border-bottom: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                margin: 0.5rem;
                padding: 0.5rem;
            }

            span.title {
                padding-left: 10px;
                margin-bottom: 0rem;
                color: var(--lumo-contrast-color);
                font-size: var(--lumo-font-size-m);
                font-weight: 500;
                /* text-transform: uppercase; */
                padding-top: 14px;
            }

            table {
                padding: 1rem;
            }

            vaadin-select ([theme~="lemon"]) {
                font-size: var(--lumo-font-micro);
            }

            vaadin-select {
                font-size: var(--lumo-font-micro);
                width: 5rem;
            }
            #label-vaadin-select-1 {
                font-size: var(--lumo-font-micro);
            }

            /* Override table styling */
            table.yld0 {
                margin-top: 0;
                margin-bottom: 1rem;
                padding: 1rem;
                padding-right: 1rem;
                padding-bottom: 1rem;
                overflow: scroll;
                /* table-layout: fixed; */
            }

            .overflow {
                overflow: auto;
            }

            table th {
                position: -webkit-sticky; // this is for all Safari (Desktop & iOS), not for Chrome
                position: sticky;
                top: 0;
                z-index: 1; // any positive value, layer order is global
                background: #fff; // any bg-color to overlap
            }

            table tr,
            table td {
                text-align: left;
                font-size: 11px;
                padding-left: 12px;
                overflow: scroll;
                max-width: 200px;
                min-width: 50px;
            }

            table tr[role="row"]:hover {
                background-color: var(--lumo-shade-5pct);
            }

            footer {
                padding: 0;
                background-color: #f7f7f9;
                border-top: 1px solid rgba(0, 0, 0, 0.125);
                min-width: 100%;
                /* push footer to bottom */
                margin-top: auto;
                /* ensure width includes padding */
                box-sizing: border-box;
            }

            #expandShrink {
                margin-left: auto;
            }

            /* visible content */

            .ellipsis_cell > div {
                position: relative;
                overflow: hidden;
                height: 1em;
            }

            .ellipsis_cell > div > span {
                display: block;
                position: absolute;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1em; /* for vertical align of text */
            }

            /* cell stretching content */
            .ellipsis_cell > div:after {
                content: attr(title);
                overflow: hidden;
                height: 0;
                display: block;
            }

            ::slotted(div[slot="topCorner"]) {
                margin-left: auto;
            }

            ::slotted(div[slot="preTable"]) {
                margin: 0.1rem;
            }

            .viewAllButton {
            }

            .iconViewAllButton {
                padding-top: 1px;
            }

            .Chart {
                margin: 1rem;
            }

            .finPeriods {
                margin: 0.2rem;
            }

            .rowHeader {
                text-align: center;
                vertical-align: middle;
                line-height: 24px;
                margin-top: 1rem;
                font-size: var(--lumo-font-size-m);
            }

            .selectedMetricGraphButton {
            }
        `,
    ];

    // -- Start of lifecycle methods -- //

    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
        if (this.width) {
            this.container.style.width = `${this.width}px`;
        }
        if (this.height) {
            this.container.style.height = `${this.height}px`;
        }
        console.log("danvir expanded", this.expanded);

        // Handle expanded
        if (this.expanded) {
            this.container.style.width = "700px";
        }

        if (this.dataset) {
            const keys = Object.keys(this.dataset);

            this.finMetricKeys = keys;

            keys.forEach((key, index) => {
                console.log(`finbar-table ${keys} ${key}: ${this.dataset[key]}`);
            });

            this.currentDataSet = this.dataset[this.finMetricKeys[0]][this.finPeriod];
        }

        //this.createLWChart();
    }

    /**
     * Builds the template render based of the args and row data.
     * @param cell - the cell object
     * @param row - The row object for the current row.
     * @returns The template function is being called with the arguments from the template_args object.
     */
    _buildTemplate(template, template_args, row) {
        const args = [];
        Object.entries(template_args).forEach(([key, value]) => {
            if (key == "row") {
                args.push(row);
            } else {
                args.push(value in row ? row[value] : value);
            }
        });

        return template(...args);
    }

    handleRowClick(e: Event, row: Object, index: number) {
        var event = new CustomEvent("row-clicked", { detail: { row: row, index: index } });
        this.dispatchEvent(event);
    }

    /**
     * It takes the data and the header definition and combines them into a new array of objects.
     * @param items - The data to be formatted.
     * @param headerCells - an array of objects that define the header cells.
     * @returns The rows of data.
     */
    // handleRowData(items, headerCells) {
    //     // Generate data using the header definition combined with the data

    //     // filter for the header cells if not be visible in non expanded version
    //     const hCells = headerCells.filter((c) => !(c.visible_only_when_expanded && !this.expanded));
    //     // const rows = items.filter((i, idx) => );
    //     //console.log('hCells', hCells)

    //     const args = [];
    //     items.map((row, index) => {
    //         const tds = [];

    //         headerCells.forEach(
    //             ({ id, template = null, template_args = {}, width_percentage, text_align, truncate_text, auto_truncate, visible_only_when_expanded, text_size, time_ago, date_format }) => {
    //                 const widthStyle = width_percentage ? `width: ${width_percentage}%;` : "width:10%;";
    //                 const textAlignStyle = "";
    //                 const textSizeStyle = text_size ? `font-size: ${text_size};` : "";

    //                 switch (true) {
    //                     case template !== null:
    //                         tds.push(html` <td style="${widthStyle} ${textAlignStyle} ${textSizeStyle}" class="ellipsis_cell">${this._buildTemplate(template, template_args, row)}</td> `);
    //                         break;
    //                     default:
    //                         tds.push(
    //                             html`
    //                                 <td style="${widthStyle} ${textAlignStyle} ${textSizeStyle}" class="ellipsis_cell">
    //                                     <div><span>${date_format ? html`${format(new Date(row[id]), "dd MMM yyyy")}` : html`${row[id]}`}</span></div>
    //                                 </td>
    //                             `
    //                         );
    //                         return;
    //                 }

    //                 //return row[id];
    //             }
    //         );
    //         args.push(
    //             html`
    //                 <tr
    //                     role="row"
    //                     index="${index}"
    //                     @click="${(e) => {
    //                         this.handleRowClick(e, row, index);
    //                     }}"
    //                 >
    //                     ${tds}
    //                 </tr>
    //             `
    //         );

    //         //return fmt_row;
    //     });
    //     return html` ${args.map((i) => html`${i}`)} `;
    // }

    generateTableBody(colHeaders) {
        const args = [];

        if (this.flipTableData) {
            if (this.dataset) {
                const keys = Object.keys(this.dataset);

                keys.forEach((key, index) => {
                    Array.from(this.dataset[key][this.finPeriod]).forEach((tsdata, i) => {
                        // Row tds
                        const tds = [];

                        keys.forEach((key, index) => {
                            const value = this.dataset[key][this.finPeriod][i].value || "-";
                            tds.push(
                                html`
                                    <td style="width: 20%;" class="ellipsis_cell">
                                        <div><span>${value}</span></div>
                                    </td>
                                `
                            );
                        });

                        args.push(
                            html`
                                <tr role="row">
                                    <th scope="row">${tsdata.time}</th>
                                    ${tds}
                                </tr>
                            `
                        );
                    });
                });
            }
        } else {
            if (this.dataset) {
                const keys = Object.keys(this.dataset);
                keys.forEach((key, index) => {
                    const tds = [];

                    // Turn ts data into a map so we can access it later
                    const tsData = {};
                    Array.from(this.dataset[key][this.finPeriod]).forEach((tsdata, i) => {
                        tsData[tsdata.time] = tsdata.value;
                    });

                    Array.from(colHeaders).forEach((header, i) => {
                        const value = tsData[header] || "-";
                        tds.push(
                            html`
                                <td style="width: 20%;" class="ellipsis_cell">
                                    <div><span>${value}</span></div>
                                </td>
                            `
                        );
                    });

                    args.push(
                        html`
                            <tr role="row">
                                <th scope="row">
                                    <vaadin-horizontal-layout>
                                        <span class="rowHeader">${this.dataset[key]["label"]}</span>
                                        <span>${this.createMiniChart(key)}</span>
                                    </vaadin-horizontal-layout>
                                </th>
                                ${tds}
                            </tr>
                        `
                    );
                });
            }
        }

        //index="${index}"
        // @click="${(e) => {
        //     this.handleRowClick(e, row, index);
        // }}"

        return html` ${args.map((i) => html`${i}`)} `;
    }

    getFinancialYear(strDate) {
        const dateString = "2014-04-03";
        var mydate = new Date(strDate + "T00:00:00");
        console.log(mydate.toDateString());
        return mydate.getFullYear();
    }

    getFinancialQuarter(strDate) {
        var mydate = new Date(strDate + "T00:00:00");
        console.log(mydate.toDateString());

        var quarter = "";
        switch (mydate.getMonth() + 1) {
            case 3:
                quarter = "Q1 ";
                break;
            case 6:
                quarter = "Q2 ";
                break;
            case 9:
                quarter = "Q3 ";
                break;
            case 12:
                quarter = "Q4 ";
                break;
            default:
        }
        console.log("poo", quarter + mydate.getFullYear(), strDate, mydate.getMonth());

        return quarter + mydate.getFullYear();
    }

    isDate(sDate) {
        if (sDate.toString() == parseInt(sDate).toString()) return false;
        var tryDate = new Date(sDate);
        return tryDate && tryDate.toString() != "NaN" && tryDate != "Invalid Date";
    }

    formatColHeader(colHeader) {
        console.log("formatColHeader");
        if (!this.isDate(colHeader)) {
            console.log("walkingdead", colHeader);
            return colHeader;
        }

        switch (this.finPeriod) {
            case "annual":
                console.log("annual");
                return this.getFinancialYear(colHeader);
                break;
            case "quarter":
                console.log("morgan");
                return this.getFinancialQuarter(colHeader);
                break;
            default:
                console.log("default", this.finPeriod);
                return colHeader;
        }
    }

    generateTableData(dataset: Object) {
        console.log("generateTableData, ", dataset);

        const colHeaders = new Set();
        if (this.dataset) {
            const keys = Object.keys(this.dataset);

            if (this.flipTableData) {
                keys.forEach((key, index) => {
                    colHeaders.add(this.dataset[key]["label"]);
                });
            } else {
                keys.forEach((key, index) => {
                    Array.from(this.dataset[key][this.finPeriod]).forEach((tsdata, i) => {
                        colHeaders.add(tsdata.time);
                    });
                });
            }
        }

        console.log("colHeaders", colHeaders);
        let array = Array.from(colHeaders);

        return html`
            <thead>
                <tr style="border-color: var(--lumo-contrast-10pct); border-bottom-style: solid; border-bottom-width: 1px;">
                    <th></th>
                    ${array.map((col, index) => {
                        return html`
                            <th style="vertical-align: bottom; text-align: left; text-transform: uppercase; font-size: var(--lumo-font-size-m);">
                                <span>${this.formatColHeader(col)}</span>
                            </th>
                        `;
                    })}
                </tr>
            </thead>
            <tbody>
                ${this.generateTableBody(colHeaders)}
            </tbody>
        `;
    }

    // Create Lightweight chart

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

        const chart = createChart(this.chartQuerySelector, {
            width: this.container.clientWidth - 50,
            height: this.container.clientHeight - 150,
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
                borderVisible: false,
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

        const barSeries = chart.addHistogramSeries({
            color: "#26a69a",
            priceFormat: {
                type: "volume",
            },
            priceScaleId: "",
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // let historical_prices_1yr = [];
        // Array.from(this.dataset["dividend_yield"]["annual"]).forEach((tsd: Object, i) => {
        //     console.log("tsds, ", tsd);
        //     historical_prices_1yr.push({
        //         time: tsd.time, //new Date(hp.date).getTime(),
        //         value: tsd.value,
        //     });
        // });

        if (this.dataset) {
            barSeries.setData([
                { time: "2019-04-11", value: 80.01 },
                { time: "2019-04-12", value: 96.63 },
                { time: "2019-04-13", value: 76.64 },
                { time: "2019-04-14", value: 81.89 },
                { time: "2019-04-15", value: 74.43 },
                { time: "2019-04-16", value: 80.01 },
                { time: "2019-04-17", value: 96.63 },
                { time: "2019-04-18", value: 76.64 },
                { time: "2019-04-19", value: 81.89 },
                { time: "2019-04-20", value: 74.43 },
            ]);
        }

        chart.timeScale().fitContent();

        // this.seriesesData.set("1D", historical_prices_1yr);

        // //this.lineSeries.setData(historical_prices_1yr);

        // //this.updateChartMarkers();

        // this.areaSeries = null;
        // this.syncToInterval(this.intervals[0]);
    }

    createMiniChart(key) {
        return html`<finbar-chart-mini .dataset=${this.dataset[key][this.finPeriod]}></finbar-chart-mini>`;
    }

    // Create charts

    // -- Main Render -- //
    render() {
        console.log("finbar-table, ", this.dataset);

        // this.results = this.items.slice(this.skip, this.skip + this.rowsPerPage);
        // console.log(this.items.length, "items length", "render", this.results);

        const headerCells = this.headerCells.filter((c) => !(c.visible_only_when_expanded && !this.expanded));

        const classes = {
            yld0: true,
            overflow: this.overflow,
        };

        const fin_periods = [
            { id: "annual", label: "Annual", selected: true }, // if you change this remember to adjust this.repeated
            { id: "quarter", label: "Quarter", selected: false },
            { id: "ttm", label: "TTM", selected: false },
        ];

        return html`
            <div class="container-wrapper">
                <div class="container">
                    <header>
                        <vaadin-horizontal-layout>
                            <span class="title">${this.title}</span>
                            <span class="viewAll" style="margin-left:auto;" class="title">
                                <vaadin-button
                                    @click=${() => {
                                        this.showBar = !this.showBar;
                                    }}
                                    >${this.showBar ? "Switch to Tabular" : "Switch to Graph"}</vaadin-button
                                >
                                <vaadin-button theme="small" class="viewAllButton" style="margin-left: 10px;" @click=${this.handleViewAll}>
                                    <vaadin-icon class="iconViewAllButton" icon="vaadin:external-link"></vaadin-icon>
                                </vaadin-button>
                            </span>
                        </vaadin-horizontal-layout>
                        <slot name="header"></slot>
                    </header>
                    ${this.showBar
                        ? html`
                              <vaadin-horizontal-layout>
                                  <span>
                                      ${Array.from(this.finMetricKeys).map((key, i) => {
                                          console.log("key", key);
                                          return html`<vaadin-button
                                              class="selectedMetricGraphButton"
                                              @click=${() => {
                                                  console.log(this.graph, key, this.finPeriod);
                                                  this.currentDataSet = this.dataset[key][this.finPeriod];
                                                  this.currentDataSetKey = key;
                                              }}
                                              >${this.dataset[key]["label"]}</vaadin-button
                                          >`;
                                      })}
                                  </span>
                              </vaadin-horizontal-layout>
                              <finbar-chart-apex id="graph" .dataset=${this.currentDataSet}></finbar-chart-apex>
                          `
                        : html`
                              <!-- Main table data -->
                              <slot name="preTable"></slot>
                              <vaadin-horizontal-layout>
                                  <span style="margin-left:auto">
                                      <toggle-group
                                          @selected-change=${(e) => {
                                              console.log("selectedch", e.detail.value);
                                              this.finPeriod = e.detail.value[0];
                                          }}
                                          class="finPeriods"
                                          theme="xsmall"
                                          label=""
                                          .items=${fin_periods}
                                      >
                                      </toggle-group>
                                  </span>
                                  <span>
                                      <vaadin-button
                                          theme="ternary"
                                          @click=${() => {
                                              this.flipTableData = !this.flipTableData;
                                          }}
                                          >flip</vaadin-button
                                      >
                                  </span>
                              </vaadin-horizontal-layout>
                              <table class="${classMap(classes)}" style="padding-top: 0rem;">
                                  ${this.generateTableData(this.dataset)}
                              </table>
                          `}
                </div>
            </div>
        `;
    }
}

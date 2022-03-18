import { LitElement, html, css, render } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { guard } from "lit/directives/guard.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";
//import ApexCharts from "apexcharts/dist/apexcharts.esm.js";
import { createChart } from "lightweight-charts";

import "fa-icons";
import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/grid";
import "@vaadin/vaadin-radio-button";
import "@vaadin/button";
import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/text-field";
import "@vaadin/select";
import "@vaadin/vertical-layout";
import "@vaadin/text-area";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/menu-bar";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { renderLoading } from "../../../helpers/utilities/graphql_helpers.js";
import { formatError, dialogGraphError } from "../../../helpers/dialog-graphql-error";
import "../../molecules/yld0-simple-message-box/message-box";

import { GetStockAlerts } from "./GetStockAlerts.query.graphql.js";
import { GetSingleStock } from "./stock-alerts/GetStock.query.graphql.js";
import { UpdateAlert } from "./stock-alerts/UpdateAlert.mutation.graphql.js";
import { DeleteAlert } from "./stock-alerts/DeleteAlert.mutation.graphql.js";
import { getSymbolFromPath } from "../../../router/index.js";

import "../../atoms/text-area/text-area.js";
import "../../atoms/notification/notification";
import "../../atoms/delete-confirm/delete-confirm";
import "./stock-alerts/alert-detail";
import "./add-alert/add-alert-modal";
import { isThisSecond } from "date-fns";

@customElement("stock-detail-alerts")
class AlertsForStock extends LitElement {
    // -- State, properties etc -- //

    @state()
    showLoading: Boolean = false;

    @state()
    private minimalMode: Boolean = false;

    @state()
    symbol: String = getSymbolFromPath();

    @state()
    stock: Object;

    @state()
    private items?;

    // -- Modal -- //

    @state()
    private modalOpen: Boolean = false;

    // --  Dialog -- //

    @state()
    dialogOpened = false;

    @property()
    dialogItem?: UserStockAlert;

    // -- End of Dialog -- //

    // -- Confirm Dialog -- //

    @state()
    confirmDialogOpen = false;

    @state()
    confirmDialogItem: Object;

    // ---- Generic Notification

    @state()
    notificationOpened = false;

    @state()
    notificationText: String = "";

    // ----

    // -- Chart Support -- //

    @query("#app")
    chart!: HTMLElement;

    @state()
    lineChart: Object;

    // -- End of Chart Support -- //

    query = new ApolloQueryController(this, GetStockAlerts, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
        variables: {
            symbol: this.symbol,
        },
    });

    query_stock = new ApolloQueryController(this, GetSingleStock, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
        variables: {
            symbol: this.symbol,
        },
    });

    mutation_update_alert = new ApolloMutationController(this, UpdateAlert);
    mutation_delete_alert = new ApolloMutationController(this, DeleteAlert);

    // -- End of properties etc -- //

    // --- Styles --- //
    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            vaadin-button {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
                height: var(--lumo-button-size);
            }

            #viewmodes {
                float: right;
                position: sticky;
                min-height: 30px;
            }

            #addToWatch {
                background-color: #250902;
                color: white;
                font-size: var(--lumo-font-size-tiny);
            }

            table tr {
                cursor: pointer;
            }

            #app {
                width: 100%;
                height: 500px;
                position: relative;
            }

            paper-toggle-button {
                --paper-toggle-button-checked-bar-color: var(--lumo-contrast);
                --paper-toggle-button-checked-button-color: var(--paper-green-500);
                --paper-toggle-button-checked-ink-color: var(--paper-green-500);
                --paper-toggle-button-unchecked-bar-color: var(--secondary-text-color);
                --paper-toggle-button-unchecked-button-color: var(--divider-color);
                --paper-toggle-button-unchecked-ink-color: var(--secondary-text-color);
            }
        `,
    ];
    // --- End of Styles --- //

    // -- Start of lifecycle methods -- //

    // We want to enable polling in case of updates
    connectedCallback() {
        super.connectedCallback();
        this.query.startPolling(30000);
        console.log("connectedCallback", this.shadowRoot);
        // this.shadowRoot.innerHTML = '<div id="app"></div>';

        // const chart = createChart(this.shadowRoot.getElementById("app"), {
        //     width: 400,
        //     height: 300,
        //     rightPriceScale: {
        //         scaleMargins: {
        //             top: 0.1,
        //             bottom: 0.1,
        //         },
        //     },
        // });
        // const lineSeries = chart.addLineSeries();
        // lineSeries.setData([
        //     { time: "2019-04-11", value: 80.01 },
        //     { time: "2019-04-12", value: 96.63 },
        //     { time: "2019-04-13", value: 76.64 },
        //     { time: "2019-04-14", value: 81.89 },
        //     { time: "2019-04-15", value: 74.43 },
        //     { time: "2019-04-16", value: 80.01 },
        //     { time: "2019-04-17", value: 96.63 },
        //     { time: "2019-04-18", value: 76.64 },
        //     { time: "2019-04-19", value: 81.89 },
        //     { time: "2019-04-20", value: 74.43 },
        // ]);
    }

    // We want to disable polling when exiting
    disconnectedCallback() {
        super.disconnectedCallback();
        this.query.stopPolling();
    }

    private firstUpdated() {
        //this.initialiseLineGraph();
        // const chart = createChart(this.chart, {
        //     width: 400,
        //     height: 300,
        //     timeScale: {
        //         visible: true,
        //     },
        //     crosshair: {
        //         horzLine: {
        //             visible: false,
        //         },
        //         vertLine: {
        //             visible: false,
        //         },
        //     },
        //     layout: {
        //         backgroundColor: "#fafafa",
        //     },
        //     grid: {
        //         vertLines: {
        //             color: "#fff",
        //         },
        //     },
        // });
        // const lineSeries = chart.addLineSeries();
        // lineSeries.setData([
        //     { time: "2019-04-11", value: 80.01 },
        //     { time: "2019-04-12", value: 96.63 },
        //     { time: "2019-04-13", value: 76.64 },
        //     { time: "2019-04-14", value: 81.89 },
        //     { time: "2019-04-15", value: 74.43 },
        //     { time: "2019-04-16", value: 80.01 },
        //     { time: "2019-04-17", value: 96.63 },
        //     { time: "2019-04-18", value: 76.64 },
        //     { time: "2019-04-19", value: 81.89 },
        //     { time: "2019-04-20", value: 74.43 },
        // ]);
        // //lineSeries.setData(historical_prices_1yr);
        // var markers = [{ time: "2019-04-16", position: "aboveBar", color: "#f68410", shape: "circle", text: "D" }];
        // markers.push({ time: "2019-04-18", position: "belowBar", color: "#e91e63", shape: "arrowUp", text: "Alert Created @" });
        // // for (var i = 0; i < datesForMarkers.length; i++) {
        // //     if (i !== indexOfMinPrice) {
        // //         markers.push({ time: datesForMarkers[i].time, position: "aboveBar", color: "#e91e63", shape: "arrowDown", text: "Sell @ " + Math.floor(datesForMarkers[i].high + 2) });
        // //     } else {
        // //         markers.push({ time: datesForMarkers[i].time, position: "belowBar", color: "#2196F3", shape: "arrowUp", text: "Buy @ " + Math.floor(datesForMarkers[i].low - 2) });
        // //     }
        // // }
        // lineSeries.setMarkers(markers);
        // chart.timeScale().fitContent();
        // document.body.style.position = 'relative';
        // var container = document.createElement('div');
        // document.body.appendChild(container);
        // ---
        // var container = document.querySelector("#app");
        // console.log("danvir", container);
        // // document.body.appendChild(container);
        // // var width = 600;
        // // var height = 300;
        // var chart = createChart(this.renderRoot.querySelector("#app"), {
        //     rightPriceScale: {
        //         scaleMargins: {
        //             top: 0.2,
        //             bottom: 0.2,
        //         },
        //         borderVisible: false,
        //     },
        //     timeScale: {
        //         visible: true,
        //         borderVisible: true,
        //         timeVisible: true,
        //         secondsVisible: true,
        //         borderColor: "rgba(197, 203, 206, 1)",
        //         fixLeftEdge: true,
        //         secondsVisible: true,
        //     },
        //     layout: {
        //         backgroundColor: "#ffffff",
        //         textColor: "#333",
        //     },
        //     grid: {
        //         horzLines: {
        //             color: "#eee",
        //         },
        //         vertLines: {
        //             color: "#ffffff",
        //         },
        //     },
        //     crosshair: {
        //         vertLine: {
        //             labelVisible: false,
        //         },
        //     },
        // });
        // // chart.resize(width, height);
        // var series = chart.addAreaSeries({
        //     topColor: "rgba(0, 150, 136, 0.56)",
        //     bottomColor: "rgba(0, 150, 136, 0.04)",
        //     lineColor: "rgba(0, 150, 136, 1)",
        //     lineWidth: 2,
        // });
        // series.setData([
        //     {
        //         time: "2018-03-28",
        //         value: 154,
        //     },
        //     {
        //         time: "2018-03-29",
        //         value: 154.2,
        //     },
        //     {
        //         time: "2018-03-30",
        //         value: 155.60001,
        //     },
        //     {
        //         time: "2018-04-02",
        //         value: 156.25,
        //     },
        //     {
        //         time: "2018-04-03",
        //         value: 156.25,
        //     },
        //     {
        //         time: "2018-04-04",
        //         value: 156.05,
        //     },
        //     {
        //         time: "2018-04-05",
        //         value: 158.05,
        //     },
        //     {
        //         time: "2018-04-06",
        //         value: 157.3,
        //     },
        //     {
        //         time: "2018-04-09",
        //         value: 144,
        //     },
        //     {
        //         time: "2018-04-10",
        //         value: 144.8,
        //     },
        //     {
        //         time: "2018-04-11",
        //         value: 143.5,
        //     },
        //     {
        //         time: "2018-04-12",
        //         value: 147.05,
        //     },
        //     {
        //         time: "2018-04-13",
        //         value: 144.85001,
        //     },
        //     {
        //         time: "2018-04-16",
        //         value: 145.39999,
        //     },
        //     {
        //         time: "2018-04-17",
        //         value: 147.3,
        //     },
        //     {
        //         time: "2018-04-18",
        //         value: 153.55,
        //     },
        //     {
        //         time: "2018-04-19",
        //         value: 150.95,
        //     },
        //     {
        //         time: "2018-04-20",
        //         value: 149.39999,
        //     },
        //     {
        //         time: "2018-04-23",
        //         value: 148.5,
        //     },
        //     {
        //         time: "2018-04-24",
        //         value: 146.60001,
        //     },
        //     {
        //         time: "2018-04-25",
        //         value: 144.45,
        //     },
        //     {
        //         time: "2018-04-26",
        //         value: 145.60001,
        //     },
        //     {
        //         time: "2018-04-27",
        //         value: 144.3,
        //     },
        //     {
        //         time: "2018-04-30",
        //         value: 144,
        //     },
        //     {
        //         time: "2018-05-02",
        //         value: 147.3,
        //     },
        //     {
        //         time: "2018-05-03",
        //         value: 144.2,
        //     },
        //     {
        //         time: "2018-05-04",
        //         value: 141.64999,
        //     },
        //     {
        //         time: "2018-05-07",
        //         value: 141.89999,
        //     },
        //     {
        //         time: "2018-05-08",
        //         value: 140.39999,
        //     },
        //     {
        //         time: "2018-05-10",
        //         value: 139.8,
        //     },
        //     {
        //         time: "2018-05-11",
        //         value: 137.5,
        //     },
        //     {
        //         time: "2018-05-14",
        //         value: 136.14999,
        //     },
        //     {
        //         time: "2018-05-15",
        //         value: 138,
        //     },
        //     {
        //         time: "2018-05-16",
        //         value: 137.95,
        //     },
        //     {
        //         time: "2018-05-17",
        //         value: 137.95,
        //     },
        //     {
        //         time: "2018-05-18",
        //         value: 136.75,
        //     },
        //     {
        //         time: "2018-05-21",
        //         value: 136.2,
        //     },
        //     {
        //         time: "2018-05-22",
        //         value: 135,
        //     },
        //     {
        //         time: "2018-05-23",
        //         value: 132.55,
        //     },
        //     {
        //         time: "2018-05-24",
        //         value: 132.7,
        //     },
        //     {
        //         time: "2018-05-25",
        //         value: 132.2,
        //     },
        //     {
        //         time: "2018-05-28",
        //         value: 131.55,
        //     },
        //     {
        //         time: "2018-05-29",
        //         value: 131.85001,
        //     },
        //     {
        //         time: "2018-05-30",
        //         value: 139.85001,
        //     },
        //     {
        //         time: "2018-05-31",
        //         value: 140.8,
        //     },
        //     {
        //         time: "2018-06-01",
        //         value: 139.64999,
        //     },
        //     {
        //         time: "2018-06-04",
        //         value: 137.10001,
        //     },
        //     {
        //         time: "2018-06-05",
        //         value: 139.25,
        //     },
        //     {
        //         time: "2018-06-06",
        //         value: 141.3,
        //     },
        //     {
        //         time: "2018-06-07",
        //         value: 145,
        //     },
        //     {
        //         time: "2018-06-08",
        //         value: 143.89999,
        //     },
        //     {
        //         time: "2018-06-11",
        //         value: 142.7,
        //     },
        //     {
        //         time: "2018-06-13",
        //         value: 144.05,
        //     },
        //     {
        //         time: "2018-06-14",
        //         value: 143.55,
        //     },
        //     {
        //         time: "2018-06-15",
        //         value: 140.5,
        //     },
        //     {
        //         time: "2018-06-18",
        //         value: 139.64999,
        //     },
        //     {
        //         time: "2018-06-19",
        //         value: 138,
        //     },
        //     {
        //         time: "2018-06-20",
        //         value: 141,
        //     },
        //     {
        //         time: "2018-06-21",
        //         value: 140.55,
        //     },
        //     {
        //         time: "2018-06-22",
        //         value: 140.55,
        //     },
        //     {
        //         time: "2018-06-25",
        //         value: 140.75,
        //     },
        //     {
        //         time: "2018-06-26",
        //         value: 140.64999,
        //     },
        //     {
        //         time: "2018-06-27",
        //         value: 141.14999,
        //     },
        //     {
        //         time: "2018-06-28",
        //         value: 139.8,
        //     },
        //     {
        //         time: "2018-06-29",
        //         value: 139.8,
        //     },
        //     {
        //         time: "2018-07-02",
        //         value: 140.14999,
        //     },
        //     {
        //         time: "2018-07-03",
        //         value: 143.05,
        //     },
        //     {
        //         time: "2018-07-04",
        //         value: 140,
        //     },
        //     {
        //         time: "2018-07-05",
        //         value: 129.2,
        //     },
        //     {
        //         time: "2018-07-06",
        //         value: 129.55,
        //     },
        //     {
        //         time: "2018-07-09",
        //         value: 128.3,
        //     },
        //     {
        //         time: "2018-07-10",
        //         value: 126.55,
        //     },
        //     {
        //         time: "2018-07-11",
        //         value: 124.3,
        //     },
        //     {
        //         time: "2018-07-12",
        //         value: 124.8,
        //     },
        //     {
        //         time: "2018-07-13",
        //         value: 123.25,
        //     },
        //     {
        //         time: "2018-07-16",
        //         value: 123,
        //     },
        //     {
        //         time: "2018-07-17",
        //         value: 124.25,
        //     },
        //     {
        //         time: "2018-07-18",
        //         value: 123,
        //     },
        //     {
        //         time: "2018-07-19",
        //         value: 121,
        //     },
        //     {
        //         time: "2018-07-20",
        //         value: 121.45,
        //     },
        //     {
        //         time: "2018-07-23",
        //         value: 123.8,
        //     },
        //     {
        //         time: "2018-07-24",
        //         value: 122.15,
        //     },
        //     {
        //         time: "2018-07-25",
        //         value: 121.3,
        //     },
        //     {
        //         time: "2018-07-26",
        //         value: 122.7,
        //     },
        //     {
        //         time: "2018-07-27",
        //         value: 122.2,
        //     },
        //     {
        //         time: "2018-07-30",
        //         value: 121.7,
        //     },
        //     {
        //         time: "2018-07-31",
        //         value: 122.95,
        //     },
        //     {
        //         time: "2018-08-01",
        //         value: 121,
        //     },
        //     {
        //         time: "2018-08-02",
        //         value: 116,
        //     },
        //     {
        //         time: "2018-08-03",
        //         value: 118.1,
        //     },
        //     {
        //         time: "2018-08-06",
        //         value: 114.3,
        //     },
        //     {
        //         time: "2018-08-07",
        //         value: 114.25,
        //     },
        //     {
        //         time: "2018-08-08",
        //         value: 111.85,
        //     },
        //     {
        //         time: "2018-08-09",
        //         value: 109.7,
        //     },
        //     {
        //         time: "2018-08-10",
        //         value: 105,
        //     },
        //     {
        //         time: "2018-08-13",
        //         value: 105.75,
        //     },
        //     {
        //         time: "2018-08-14",
        //         value: 107.25,
        //     },
        //     {
        //         time: "2018-08-15",
        //         value: 107.4,
        //     },
        //     {
        //         time: "2018-08-16",
        //         value: 110.5,
        //     },
        //     {
        //         time: "2018-08-17",
        //         value: 109,
        //     },
        //     {
        //         time: "2018-08-20",
        //         value: 108.95,
        //     },
        //     {
        //         time: "2018-08-21",
        //         value: 108.35,
        //     },
        //     {
        //         time: "2018-08-22",
        //         value: 108.6,
        //     },
        //     {
        //         time: "2018-08-23",
        //         value: 105.65,
        //     },
        //     {
        //         time: "2018-08-24",
        //         value: 104.45,
        //     },
        //     {
        //         time: "2018-08-27",
        //         value: 106.2,
        //     },
        //     {
        //         time: "2018-08-28",
        //         value: 106.55,
        //     },
        //     {
        //         time: "2018-08-29",
        //         value: 111.8,
        //     },
        //     {
        //         time: "2018-08-30",
        //         value: 115.5,
        //     },
        //     {
        //         time: "2018-08-31",
        //         value: 115.5,
        //     },
        //     {
        //         time: "2018-09-03",
        //         value: 114.55,
        //     },
        //     {
        //         time: "2018-09-04",
        //         value: 112.75,
        //     },
        //     {
        //         time: "2018-09-05",
        //         value: 111.5,
        //     },
        //     {
        //         time: "2018-09-06",
        //         value: 108.1,
        //     },
        //     {
        //         time: "2018-09-07",
        //         value: 108.55,
        //     },
        //     {
        //         time: "2018-09-10",
        //         value: 106.5,
        //     },
        //     {
        //         time: "2018-09-11",
        //         value: 105.1,
        //     },
        //     {
        //         time: "2018-09-12",
        //         value: 107.2,
        //     },
        //     {
        //         time: "2018-09-13",
        //         value: 107.1,
        //     },
        //     {
        //         time: "2018-09-14",
        //         value: 105.75,
        //     },
        //     {
        //         time: "2018-09-17",
        //         value: 106.05,
        //     },
        //     {
        //         time: "2018-09-18",
        //         value: 109.15,
        //     },
        //     {
        //         time: "2018-09-19",
        //         value: 111.4,
        //     },
        //     {
        //         time: "2018-09-20",
        //         value: 111,
        //     },
        //     {
        //         time: "2018-09-21",
        //         value: 111,
        //     },
        //     {
        //         time: "2018-09-24",
        //         value: 108.95,
        //     },
        //     {
        //         time: "2018-09-25",
        //         value: 106.65,
        //     },
        //     {
        //         time: "2018-09-26",
        //         value: 106.7,
        //     },
        //     {
        //         time: "2018-09-27",
        //         value: 107.05,
        //     },
        //     {
        //         time: "2018-09-28",
        //         value: 106.55,
        //     },
        //     {
        //         time: "2018-10-01",
        //         value: 106.2,
        //     },
        //     {
        //         time: "2018-10-02",
        //         value: 106.4,
        //     },
        //     {
        //         time: "2018-10-03",
        //         value: 107.1,
        //     },
        //     {
        //         time: "2018-10-04",
        //         value: 106.4,
        //     },
        //     {
        //         time: "2018-10-05",
        //         value: 104.65,
        //     },
        //     {
        //         time: "2018-10-08",
        //         value: 102.65,
        //     },
        //     {
        //         time: "2018-10-09",
        //         value: 102.1,
        //     },
        //     {
        //         time: "2018-10-10",
        //         value: 102.15,
        //     },
        //     {
        //         time: "2018-10-11",
        //         value: 100.9,
        //     },
        //     {
        //         time: "2018-10-12",
        //         value: 102,
        //     },
        //     {
        //         time: "2018-10-15",
        //         value: 100.15,
        //     },
        //     {
        //         time: "2018-10-16",
        //         value: 99,
        //     },
        //     {
        //         time: "2018-10-17",
        //         value: 98,
        //     },
        //     {
        //         time: "2018-10-18",
        //         value: 96,
        //     },
        //     {
        //         time: "2018-10-19",
        //         value: 95.5,
        //     },
        //     {
        //         time: "2018-10-22",
        //         value: 92.400002,
        //     },
        //     {
        //         time: "2018-10-23",
        //         value: 92.300003,
        //     },
        //     {
        //         time: "2018-10-24",
        //         value: 92.900002,
        //     },
        //     {
        //         time: "2018-10-25",
        //         value: 91.849998,
        //     },
        //     {
        //         time: "2018-10-26",
        //         value: 91.599998,
        //     },
        //     {
        //         time: "2018-10-29",
        //         value: 94.050003,
        //     },
        //     {
        //         time: "2018-10-30",
        //         value: 98.25,
        //     },
        //     {
        //         time: "2018-10-31",
        //         value: 97.25,
        //     },
        //     {
        //         time: "2018-11-01",
        //         value: 96.879997,
        //     },
        //     {
        //         time: "2018-11-02",
        //         value: 101.78,
        //     },
        //     {
        //         time: "2018-11-06",
        //         value: 102.4,
        //     },
        //     {
        //         time: "2018-11-07",
        //         value: 100.6,
        //     },
        //     {
        //         time: "2018-11-08",
        //         value: 98.5,
        //     },
        //     {
        //         time: "2018-11-09",
        //         value: 95.139999,
        //     },
        //     {
        //         time: "2018-11-12",
        //         value: 96.900002,
        //     },
        //     {
        //         time: "2018-11-13",
        //         value: 97.400002,
        //     },
        //     {
        //         time: "2018-11-14",
        //         value: 103.3,
        //     },
        //     {
        //         time: "2018-11-15",
        //         value: 102.74,
        //     },
        //     {
        //         time: "2018-11-16",
        //         value: 101.2,
        //     },
        //     {
        //         time: "2018-11-19",
        //         value: 98.720001,
        //     },
        //     {
        //         time: "2018-11-20",
        //         value: 102.2,
        //     },
        //     {
        //         time: "2018-11-21",
        //         value: 108.8,
        //     },
        //     {
        //         time: "2018-11-22",
        //         value: 109.9,
        //     },
        //     {
        //         time: "2018-11-23",
        //         value: 113.74,
        //     },
        //     {
        //         time: "2018-11-26",
        //         value: 110.9,
        //     },
        //     {
        //         time: "2018-11-27",
        //         value: 113.28,
        //     },
        //     {
        //         time: "2018-11-28",
        //         value: 113.6,
        //     },
        //     {
        //         time: "2018-11-29",
        //         value: 113.14,
        //     },
        //     {
        //         time: "2018-11-30",
        //         value: 114.4,
        //     },
        //     {
        //         time: "2018-12-03",
        //         value: 111.84,
        //     },
        //     {
        //         time: "2018-12-04",
        //         value: 106.7,
        //     },
        //     {
        //         time: "2018-12-05",
        //         value: 107.8,
        //     },
        //     {
        //         time: "2018-12-06",
        //         value: 106.44,
        //     },
        //     {
        //         time: "2018-12-07",
        //         value: 103.7,
        //     },
        //     {
        //         time: "2018-12-10",
        //         value: 101.02,
        //     },
        //     {
        //         time: "2018-12-11",
        //         value: 102.72,
        //     },
        //     {
        //         time: "2018-12-12",
        //         value: 101.8,
        //     },
        //     {
        //         time: "2018-12-13",
        //         value: 102,
        //     },
        //     {
        //         time: "2018-12-14",
        //         value: 102.1,
        //     },
        //     {
        //         time: "2018-12-17",
        //         value: 101.04,
        //     },
        //     {
        //         time: "2018-12-18",
        //         value: 101.6,
        //     },
        //     {
        //         time: "2018-12-19",
        //         value: 102,
        //     },
        //     {
        //         time: "2018-12-20",
        //         value: 102.02,
        //     },
        //     {
        //         time: "2018-12-21",
        //         value: 102.2,
        //     },
        //     {
        //         time: "2018-12-24",
        //         value: 102.1,
        //     },
        //     {
        //         time: "2018-12-25",
        //         value: 100.8,
        //     },
        //     {
        //         time: "2018-12-26",
        //         value: 101.02,
        //     },
        //     {
        //         time: "2018-12-27",
        //         value: 100.5,
        //     },
        //     {
        //         time: "2018-12-28",
        //         value: 101,
        //     },
        //     {
        //         time: "2019-01-03",
        //         value: 101.5,
        //     },
        //     {
        //         time: "2019-01-04",
        //         value: 101.1,
        //     },
        //     {
        //         time: "2019-01-08",
        //         value: 101.1,
        //     },
        //     {
        //         time: "2019-01-09",
        //         value: 102.06,
        //     },
        //     {
        //         time: "2019-01-10",
        //         value: 105.14,
        //     },
        //     {
        //         time: "2019-01-11",
        //         value: 104.66,
        //     },
        //     {
        //         time: "2019-01-14",
        //         value: 106.22,
        //     },
        //     {
        //         time: "2019-01-15",
        //         value: 106.98,
        //     },
        //     {
        //         time: "2019-01-16",
        //         value: 108.4,
        //     },
        //     {
        //         time: "2019-01-17",
        //         value: 109.06,
        //     },
        //     {
        //         time: "2019-01-18",
        //         value: 107,
        //     },
        //     {
        //         time: "2019-01-21",
        //         value: 105.8,
        //     },
        //     {
        //         time: "2019-01-22",
        //         value: 105.24,
        //     },
        //     {
        //         time: "2019-01-23",
        //         value: 105.4,
        //     },
        //     {
        //         time: "2019-01-24",
        //         value: 105.38,
        //     },
        //     {
        //         time: "2019-01-25",
        //         value: 105.7,
        //     },
        //     {
        //         time: "2019-01-28",
        //         value: 105.8,
        //     },
        //     {
        //         time: "2019-01-29",
        //         value: 106.1,
        //     },
        //     {
        //         time: "2019-01-30",
        //         value: 108.6,
        //     },
        //     {
        //         time: "2019-01-31",
        //         value: 107.92,
        //     },
        //     {
        //         time: "2019-02-01",
        //         value: 105.22,
        //     },
        //     {
        //         time: "2019-02-04",
        //         value: 102.44,
        //     },
        //     {
        //         time: "2019-02-05",
        //         value: 102.26,
        //     },
        //     {
        //         time: "2019-02-06",
        //         value: 102,
        //     },
        //     {
        //         time: "2019-02-07",
        //         value: 101.62,
        //     },
        //     {
        //         time: "2019-02-08",
        //         value: 101.9,
        //     },
        //     {
        //         time: "2019-02-11",
        //         value: 101.78,
        //     },
        //     {
        //         time: "2019-02-12",
        //         value: 102.7,
        //     },
        //     {
        //         time: "2019-02-13",
        //         value: 100.14,
        //     },
        //     {
        //         time: "2019-02-14",
        //         value: 101.36,
        //     },
        //     {
        //         time: "2019-02-15",
        //         value: 101.62,
        //     },
        //     {
        //         time: "2019-02-18",
        //         value: 100.74,
        //     },
        //     {
        //         time: "2019-02-19",
        //         value: 100,
        //     },
        //     {
        //         time: "2019-02-20",
        //         value: 100.04,
        //     },
        //     {
        //         time: "2019-02-21",
        //         value: 100,
        //     },
        //     {
        //         time: "2019-02-22",
        //         value: 100.12,
        //     },
        //     {
        //         time: "2019-02-25",
        //         value: 100.04,
        //     },
        //     {
        //         time: "2019-02-26",
        //         value: 98.980003,
        //     },
        //     {
        //         time: "2019-02-27",
        //         value: 97.699997,
        //     },
        //     {
        //         time: "2019-02-28",
        //         value: 97.099998,
        //     },
        //     {
        //         time: "2019-03-01",
        //         value: 96.760002,
        //     },
        //     {
        //         time: "2019-03-04",
        //         value: 98.360001,
        //     },
        //     {
        //         time: "2019-03-05",
        //         value: 96.260002,
        //     },
        //     {
        //         time: "2019-03-06",
        //         value: 98.120003,
        //     },
        //     {
        //         time: "2019-03-07",
        //         value: 99.68,
        //     },
        //     {
        //         time: "2019-03-11",
        //         value: 102.1,
        //     },
        //     {
        //         time: "2019-03-12",
        //         value: 100.22,
        //     },
        //     {
        //         time: "2019-03-13",
        //         value: 100.5,
        //     },
        //     {
        //         time: "2019-03-14",
        //         value: 99.660004,
        //     },
        //     {
        //         time: "2019-03-15",
        //         value: 100.08,
        //     },
        //     {
        //         time: "2019-03-18",
        //         value: 99.919998,
        //     },
        //     {
        //         time: "2019-03-19",
        //         value: 99.459999,
        //     },
        //     {
        //         time: "2019-03-20",
        //         value: 98.220001,
        //     },
        //     {
        //         time: "2019-03-21",
        //         value: 97.300003,
        //     },
        //     {
        //         time: "2019-03-22",
        //         value: 97.660004,
        //     },
        //     {
        //         time: "2019-03-25",
        //         value: 97,
        //     },
        //     {
        //         time: "2019-03-26",
        //         value: 97.019997,
        //     },
        //     {
        //         time: "2019-03-27",
        //         value: 96.099998,
        //     },
        //     {
        //         time: "2019-03-28",
        //         value: 96.699997,
        //     },
        //     {
        //         time: "2019-03-29",
        //         value: 96.300003,
        //     },
        //     {
        //         time: "2019-04-01",
        //         value: 97.779999,
        //     },
        //     {
        //         time: "2019-04-02",
        //         value: 98.360001,
        //     },
        //     {
        //         time: "2019-04-03",
        //         value: 98.5,
        //     },
        //     {
        //         time: "2019-04-04",
        //         value: 98.360001,
        //     },
        //     {
        //         time: "2019-04-05",
        //         value: 99.540001,
        //     },
        //     {
        //         time: "2019-04-08",
        //         value: 98.580002,
        //     },
        //     {
        //         time: "2019-04-09",
        //         value: 97.239998,
        //     },
        //     {
        //         time: "2019-04-10",
        //         value: 97.32,
        //     },
        //     {
        //         time: "2019-04-11",
        //         value: 98.400002,
        //     },
        //     {
        //         time: "2019-04-12",
        //         value: 98.220001,
        //     },
        //     {
        //         time: "2019-04-15",
        //         value: 98.720001,
        //     },
        //     {
        //         time: "2019-04-16",
        //         value: 99.120003,
        //     },
        //     {
        //         time: "2019-04-17",
        //         value: 98.620003,
        //     },
        //     {
        //         time: "2019-04-18",
        //         value: 98,
        //     },
        //     {
        //         time: "2019-04-19",
        //         value: 97.599998,
        //     },
        //     {
        //         time: "2019-04-22",
        //         value: 97.599998,
        //     },
        //     {
        //         time: "2019-04-23",
        //         value: 96.800003,
        //     },
        //     {
        //         time: "2019-04-24",
        //         value: 96.32,
        //     },
        //     {
        //         time: "2019-04-25",
        //         value: 96.339996,
        //     },
        //     {
        //         time: "2019-04-26",
        //         value: 97.120003,
        //     },
        //     {
        //         time: "2019-04-29",
        //         value: 96.980003,
        //     },
        //     {
        //         time: "2019-04-30",
        //         value: 96.32,
        //     },
        //     {
        //         time: "2019-05-02",
        //         value: 96.860001,
        //     },
        //     {
        //         time: "2019-05-03",
        //         value: 96.699997,
        //     },
        //     {
        //         time: "2019-05-06",
        //         value: 94.940002,
        //     },
        //     {
        //         time: "2019-05-07",
        //         value: 94.5,
        //     },
        //     {
        //         time: "2019-05-08",
        //         value: 94.239998,
        //     },
        //     {
        //         time: "2019-05-10",
        //         value: 92.900002,
        //     },
        //     {
        //         time: "2019-05-13",
        //         value: 91.279999,
        //     },
        //     {
        //         time: "2019-05-14",
        //         value: 91.599998,
        //     },
        //     {
        //         time: "2019-05-15",
        //         value: 90.080002,
        //     },
        //     {
        //         time: "2019-05-16",
        //         value: 91.68,
        //     },
        //     {
        //         time: "2019-05-17",
        //         value: 91.959999,
        //     },
        //     {
        //         time: "2019-05-20",
        //         value: 91.080002,
        //     },
        //     {
        //         time: "2019-05-21",
        //         value: 90.760002,
        //     },
        //     {
        //         time: "2019-05-22",
        //         value: 91,
        //     },
        //     {
        //         time: "2019-05-23",
        //         value: 90.739998,
        //     },
        //     {
        //         time: "2019-05-24",
        //         value: 91,
        //     },
        //     {
        //         time: "2019-05-27",
        //         value: 91.199997,
        //     },
        //     {
        //         time: "2019-05-28",
        //         value: 90.68,
        //     },
        //     {
        //         time: "2019-05-29",
        //         value: 91.120003,
        //     },
        //     {
        //         time: "2019-05-30",
        //         value: 90.419998,
        //     },
        //     {
        //         time: "2019-05-31",
        //         value: 93.800003,
        //     },
        //     {
        //         time: "2019-06-03",
        //         value: 96.800003,
        //     },
        //     {
        //         time: "2019-06-04",
        //         value: 96.34,
        //     },
        //     {
        //         time: "2019-06-05",
        //         value: 95.94,
        //     },
        // ]);
        // function businessDayToString(businessDay) {
        //     return businessDay.year + "-" + businessDay.month + "-" + businessDay.day;
        // }
        // chart.timeScale().resetTimeScale();
        // chart.timeScale().setVisibleRange({
        //     from: new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0)).getTime() / 1000,
        //     to: new Date(Date.UTC(2018, 1, 1, 0, 0, 0, 0)).getTime() / 1000,
        // });
        // var toolTipWidth = 80;
        // var toolTipHeight = 80;
        // var toolTipMargin = 15;
        // var toolTip = document.createElement("div");
        // toolTip.className = "floating-tooltip-2";
        // container.appendChild(toolTip);
        // update tooltip
        // chart.subscribeCrosshairMove(function (param) {
        //     console.log(param);
        //     if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > container.clientWidth || param.point.y < 0 || param.point.y > container.clientHeight) {
        //         toolTip.style.display = "none";
        //     } else {
        //         const dateStr = businessDayToString(param.time);
        //         toolTip.style.display = "block";
        //         var price = param.seriesPrices.get(series);
        //         toolTip.innerHTML =
        //             '<div style="color: #009688">Apple Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: #21384d">' +
        //             Math.round(100 * price) / 100 +
        //             '</div><div style="color: #21384d">' +
        //             dateStr +
        //             "</div>";
        //         var coordinate = series.priceToCoordinate(price);
        //         var shiftedCoordinate = param.point.x - 50;
        //         if (coordinate === null) {
        //             return;
        //         }
        //         shiftedCoordinate = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate));
        //         var coordinateY =
        //             coordinate - toolTipHeight - toolTipMargin > 0
        //                 ? coordinate - toolTipHeight - toolTipMargin
        //                 : Math.max(0, Math.min(container.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
        //         toolTip.style.left = shiftedCoordinate + "px";
        //         toolTip.style.top = coordinateY + "px";
        //     }
        // });
    }

    // --- End of lifecycles --- //

    // -- Other functions -- //

    // private initialiseLineGraph() {
    //     let annotations_yaxis = [
    //         {
    //             y: this.stock?.price_number,
    //             borderColor: "black",
    //             label: {
    //                 borderColor: "black",
    //                 style: {
    //                     color: "#fff",
    //                     background: "black",
    //                 },
    //                 text: "current price",
    //             },
    //         },

    //         {
    //             y: 60,
    //             y2: 70,
    //             borderColor: "#000",
    //             fillColor: "#FEB019",
    //             label: {
    //                 text: "Y-axis range",
    //             },
    //         },
    //     ];

    //     var options = {
    //         series: [
    //             {
    //                 name: "XYZ MOTORS",
    //                 data: [
    //                     {
    //                         x: new Date("2018-02-10").getTime(),
    //                         y: 76,
    //                     },
    //                     {
    //                         x: new Date("2018-02-12").getTime(),
    //                         y: 50,
    //                     },
    //                 ],
    //             },
    //         ],
    //         chart: {
    //             type: "area",
    //             stacked: false,
    //             height: 350,
    //             zoom: {
    //                 type: "x",
    //                 enabled: true,
    //                 autoScaleYaxis: true,
    //             },
    //             toolbar: {
    //                 autoSelected: "zoom",
    //             },
    //         },
    //         dataLabels: {
    //             enabled: false,
    //         },
    //         markers: {
    //             size: 0,
    //         },
    //         title: {
    //             text: "Stock Price Movement",
    //             align: "left",
    //         },
    //         annotations: {
    //             yaxis: annotations_yaxis,
    //         },
    //         fill: {
    //             type: "gradient",
    //             gradient: {
    //                 shadeIntensity: 1,
    //                 inverseColors: false,
    //                 opacityFrom: 0.5,
    //                 opacityTo: 0,
    //                 stops: [0, 90, 100],
    //             },
    //         },
    //         yaxis: {
    //             labels: {
    //                 formatter: function (val) {
    //                     return val;
    //                     //return (val / 1000000).toFixed(0);
    //                 },
    //             },
    //             title: {
    //                 text: "Price",
    //             },
    //         },
    //         xaxis: {
    //             type: "datetime",
    //         },
    //         tooltip: {
    //             shared: false,
    //             y: {
    //                 formatter: function (val) {
    //                     return val;
    //                     //return (val / 1000000).toFixed(0);
    //                 },
    //             },
    //         },
    //     };

    //     this.lineChart = new ApexCharts(this.chart, options);
    //     this.lineChart.render();
    // }

    private handleRowClick(e: Event, item: Object) {
        console.debug("handleRowClick", item);
        this.dialogOpened = true;
        this.dialogItem = item;
        //this.lineChart.render();
    }

    private async handleMenuAction(e: Event, item: Object) {
        console.log("handleMenuAction", e.detail.value);
        const value = e.detail.value;

        if (value.text == "Delete") {
            // need a dialog for confirm first
            this.confirmDialogOpen = true;
            this.confirmDialogItem = item;
        } else if (value.text == "Edit") {
            this.handleRowClick(e, item);
        }
    }

    private createItem() {
        const item = document.createElement("vaadin-context-menu-item");
        const icon = document.createElement("vaadin-icon");
        item.setAttribute("aria-label", "Other save options");
        icon.setAttribute("icon", `vaadin:ellipsis-dots-v`);
        item.appendChild(icon);
        return item;
    }

    private renderMenu(item: UserStockAlert) {
        var items = [
            {
                component: this.createItem(),
                // { component: "hr" }, { text: "Suggest new feature" }
                children: [{ component: "hr" }, { text: "Edit" }, { text: "Delete" }],
            },
        ];
        return html` <vaadin-menu-bar style="z-index: -1;" theme="icon" .items="${items}" @item-selected=${async (e) => this.handleMenuAction(e, item)}></vaadin-menu-bar>`;
    }

    private async handleEnable(e: Event, item: object) {
        e.stopPropagation();
        await this.handleUpdateAlert(item);
    }

    private handleCancelDeleteAlert(e: Event) {
        console.log("handleCancelDelete");
    }

    async handleDeleteAlert(item: object) {
        const { data, error, loading } = await this.mutation_delete_alert.mutate({
            variables: {
                uuid: item.uuid,
            },
            update: (store, {}) => {
                // Read the data from the cache for this query.
                const dataQ = store.readQuery({
                    query: GetStockAlerts,
                    variables: {
                        symbol: this.symbol,
                    },
                });
                const items = this.items.filter((e) => e !== item);
                const update = { ...dataQ, alerts: { ...dataQ.alerts, items } };
                // Write the data back to the cache.
                store.writeQuery({ query: GetStockAlerts, data: update, variables: { symbol: this.symbol } });
            },
        });
        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = "Deleted alert.";
        }
    }

    async handleUpdateAlert(alert: object) {
        console.log("handleUpdateAlert", alert);
        const { data, error, loading } = await this.mutation_update_alert.mutate({
            variables: {
                uuid: alert.uuid,
                repeated: alert.repeated,
                notes: alert.notes,
                notification_types: alert.notification_types,
                enabled: alert.enabled,
            },
        });

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = "Updated alert.";
            this.dialogOpened = false;
        }
    }

    private handleAddAlertToStock(e: Event) {
        this.modalOpen = true;
        this.showSelectStock = false;
    }

    private handleMinimalMode(e: Event) {
        // Change the selected mode
        console.debug("handleMinimalMode,", e.detail);
        this.minimalMode = e.detail.value == 0;
    }

    // -- Other Renders -- //

    private renderRow(item, index) {
        return html`
            <tr role="row" index="${index}" @click=${(e) => this.handleRowClick(e, item)}>
                <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                <td style="width: 97%;">
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <!-- <vaadin-avatar img="${item?.logoUrl}" name="${item.title}" theme="xsmall"></vaadin-avatar> -->
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span class="stockSymbol">${item.title} </span>
                            <!-- <span class="companyName">${item.notes}</span> -->
                            ${this.minimalMode ? html`` : html`<span style="font-size: 0.6em;">${item.notes}</span>`}
                            <span style="font-size: 0.6em;">
                                ${item.repeated ? html`repeated alert | ` : html``} ${item.info}
                                ${item.notification_types?.map((nt, index) => {
                                    const prefix = index == 0 ? html`<span style="margin-left: 0.5em; margin-right: 0.5em;">|</span>` : null;

                                    if (nt == "EMAIL_NOTIFICATION") {
                                        return html`${prefix}<vaadin-icon style="color: var(--lumo-contrast); font-size: 1em; margin-right: 0.3em;" icon="vaadin:mailbox"></vaadin-icon>`;
                                    } else if (nt == "PUSH_NOTIFICATION") {
                                        return html`${prefix}<vaadin-icon style="color: var(--lumo-contrast); font-size: 1.5em; margin-right: 0.3em;" icon="lumo:bell"></vaadin-icon>`;
                                    }
                                })}
                            </span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width: 2%;">
                    <paper-toggle-button
                        ?checked=${item.enabled}
                        @click=${async (e) => {
                            var itemMod = { ...item };
                            itemMod.enabled = !item.enabled;
                            this.handleEnable(e, itemMod);
                        }}
                    >
                    </paper-toggle-button>
                </td>
                <td style="width: 1%;">${this.renderMenu(item)}</td>
            </tr>
        `;
    }

    private renderLastRow() {
        return html`
            <tr style="border: none;">
                <td style="width: 55%;border: none;"></td>
                <td style="width:40%; border: none; text-align: right;">
                    <vaadin-button theme="small" id="addToWatch" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>Add</vaadin-button>
                </td>
                <td style="width: 5%; border: none;"></td>
            </tr>
        `;
    }

    // -- Main Render -- //
    render() {
        this.stock = this.query_stock.data?.single_stock;

        console.log("stock", this.stock);

        const { data, options, loading, error, errors, networkStatus } = this.query;
        this.items = data?.alerts.items;
        console.debug(data, loading, error, errors, networkStatus, this.items);

        if (error) {
            return dialogGraphError(formatError(options, error));
        }

        let t;
        if (loading) {
            t = setTimeout(() => {
                this.showLoading = true;
            }, 3000);
        }

        if (!loading) {
            this.showLoading = false;
            clearTimeout(t);
        }

        if (this.showLoading && loading) {
            return renderLoading();
        }

        return html`
            ${this.items?.length == 0
                ? html`
                      <message-box
                          loaded
                          boxImg="/images/no_items_alerts.svg"
                          boxTitle="No alerts configured for ${this.symbol} "
                          boxSubtitle="Go back to the main alerts page to add an alert."
                          help=""
                      >
                      </message-box>
                  `
                : html` <!-- <div class="Chart"></div>
                      <br /> -->

                      <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m); display: block; padding: var(--lumo-space-xs);">
                          <vaadin-horizontal-layout style="align-items: center; text-align: center;padding-left: 15%; padding-right: 15%;" theme="spacing">
                              <span><vaadin-avatar img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: var(--lumo-size-xl);"></vaadin-avatar></span>
                              <vaadin-vertical-layout>
                                  <span class="stockSymbolBig" style="width: 150px;"> ${this.stock.symbol} </span>
                                  <span class="companyName" style="width: 150px; font-size: var(--lumo-font-size-m)"> ${this.stock.company_name} </span>
                              </vaadin-vertical-layout>
                          </vaadin-horizontal-layout>
                      </vaadin-vertical-layout>

                      <!-- Main table data -->
                      <table class="yld0">
                          <thead>
                              <tr style="border-color: var(--lumo-contrast-10pct);border-bottom-style: solid;border-bottom-width: 1px;">
                                  <th style="vertical-align: bottom;">
                                      <span class="headerTitle">Alerts</span>
                                  </th>
                                  <th></th>

                                  <vaadin-horizontal-layout id="viewmodes" style="align-items: right;" theme="spacing">
                                      <vaadin-list-box
                                          @selected-changed=${this.handleMinimalMode}
                                          style="position: sticky; font-size: var(--lumo-font-size-micro); margin: 0px;  float:right;"
                                          selected="1"
                                      >
                                          <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);">minimal mode</vaadin-item>
                                          <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);">show more</vaadin-item>
                                      </vaadin-list-box>
                                  </vaadin-horizontal-layout>
                              </tr>
                          </thead>
                          ${this.items?.map((item, index) => {
                              return html`${this.renderRow(item, index)}`;
                          })}
                          ${this.renderLastRow()}
                      </table>`}

            <!-- dialog -->
            <vaadin-dialog
                aria-label="Help Info"
                .opened="${this.dialogOpened}"
                @opened-changed="${(e: CustomEvent) => (this.dialogOpened = e.detail.value)}"
                .renderer="${guard([this.mutation_update_alert], () => (root: HTMLElement) => {
                    render(
                        html`
                            <alert-detail
                                @save=${async (e) => {
                                    await this.handleUpdateAlert(e.detail.alert);
                                    this.query.refetch();
                                    this.dialogOpened = false;
                                }}
                                @close=${() => {
                                    this.dialogOpened = false;
                                }}
                                .stock=${this.stock}
                                .alert=${this.dialogItem}
                            ></alert-detail>
                        `,
                        root
                    );
                })}"
            ></vaadin-dialog>

            <!-- delete dialog -->
            <delete-confirm
                header="You're about to delete an alert"
                description="Are you sure you want to delete the alert '${this.confirmDialogItem?.title}'? The following action is permanent and cannot be undone."
                ?open=${this.confirmDialogOpen}
                .contextItem=${this.confirmDialogItem}
                @confirm=${async (e) => {
                    console.log("confirm");
                    this.confirmDialogOpen = false;
                    await this.handleDeleteAlert(e.detail.value);
                }}
                @cancel=${() => {
                    console.log("cancel");
                    this.confirmDialogOpen = false;
                }}
            ></delete-confirm>

            <!-- notification -->
            <generic-notification
                ?opened=${this.notificationOpened}
                .text="${this.notificationText}"
                @opened-changed="${(e: NotificationOpenedChangedEvent) => {
                    this.notificationOpened = e.detail.value;
                }}"
            ></generic-notification>

            <!-- add alert modal -->
            <addalert-modal
                .stock=${this.stock}
                title="Add an Alert to ${this.stock.symbol}"
                ?open="${this.modalOpen}"
                ?showSelectStock=${this.showSelectStock}
                @closed="${(e: CustomEvent) => {
                    this.modalOpen = e.detail.value;
                    this.query.refetch();
                }}"
            ></addalert-modal>

            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

// <vaadin-horizontal-layout>
// <vaadin-vertical-layout>
//     <span class="description"> ${this.stock.symbol}</span>
//     <span class="description" style="font-size: var(--lumo-font-size-micro)"> ${this.stock.company_name}</span>
// </vaadin-vertical-layout>
// </vaadin-horizontal-layout>
// <vaadin-vertical-layout theme="spacing" style="width: 300px; max-width: 100%; align-items: stretch;">
// <h3 style="margin: var(--lumo-space-m) 0; font-weight: bold;">${this.dialogItem?.title}</h3>
// <p style="font-size: var(--lumo-font-size-xxs);" label="Description">${this.dialogItem?.description}</p>
// </vaadin-vertical-layout>
// <link rel="stylesheet" href="/node_modules/apexcharts/dist/apexcharts.css" />
// <div class="Chart"></div>
// <text-area
// label="Notes"
// @on-change=${(e) => {
//     var item = { ...this.dialogItem };
//     item.notes = e.detail.value;
//     this.dialogItem = item;
//     console.log(this.dialogItem);
// }}
// value=${this.dialogItem?.notes}
// ></text-area>
// <footer style="padding: var(--lumo-space-s) var(--lumo-space-m); text-align: right;">
// <vaadin-button theme="tertiary" style="margin-inline-end: var(--lumo-space-m);" @click="${() => (this.dialogOpened = false)}"> Cancel </vaadin-button>
// <vaadin-button
//     theme="primary"
//     @click="${async () => {
//         console.log("save", this.dialogItem);
//         const { data, error, loading } = await this.mutation_update_alert.mutate({
//             variables: {
//                 uuid: this.dialogItem?.uuid,
//                 repeated: this.dialogItem?.repeated,
//                 notes: this.dialogItem?.notes,
//                 enabled: this.dialogItem?.enabled,
//             },
//         });

//         if (error && !loading) {
//             this.notificationOpened = true;
//             this.notificationText = `${error}`;
//         } else if (!error && !loading) {
//             this.notificationOpened = true;
//             this.notificationText = "Updated alert.";
//             this.dialogOpened = false;
//         }
//     }}"
// >
//     Save
// </vaadin-button>
// </footer>

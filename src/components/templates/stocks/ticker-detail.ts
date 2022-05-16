import { LitElement, html, css, render } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { guard } from "lit/directives/guard.js";

import { formatDistance, isThisISOWeek } from "date-fns";

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
import { getSymbolFromPath } from "../../../router/index.js";

import "../../molecules/yld0-simple-message-box/message-box";
import "../../atoms/tool-tip/tool-tip";
import "../../atoms/text-area/text-area.js";
import "../../atoms/notification/notification";
import "../../atoms/delete-confirm/delete-confirm";
import "../../atoms/container-list/container-list.ts";
import "../../molecules/dialog-card/generic-dialog-card.ts";
import "../../organisms/tabs/yld0-tab";
import "../../organisms/modal-up/modal-up";
import "../../organisms/stock-benchmarks-card/stock-benchmarks-card";
//import "../../organisms/stock-dividends-history/stock-dividends-history";
import "../../organisms/stock-dividends/stock-dividends";
import "../../organisms/financial-health/financial-health";
import "../../organisms/company-profile-card/company-profile-card";
import "../../organisms/stock-profile-card/stock-profile-card";
import "../../organisms/company-investor-relations-card/company-investor-relations-card";
import "../../organisms/press-releases-card/press-releases-card";
import "../../organisms/company-news-card/company-news-card";
import "../../organisms/sec-filings-card/sec-filings-card";
import "../../organisms/insider-trading-card/insider-trading-card";
import "../../molecules/container-card-info/container-card-info";

import "../yld0-tabs";
import "../yld0-tabitem";
import "./search-in-stock";
import "./notes/notes";
import "./notes/add-note";
import "./checklists/checklists";
import "./checklists/checklist-modal";
import "./checklists/run-checklist-modal";
import "../y-checklist-run/y-checklist-run";
import "../y-checklist/y-checklist";
import "./notes/add-note";
import { GetSingleStock } from "./GetSingleStock.query.graphql.js";

import { Follow } from "./Follow.mutation.graphql.js";
import { UnFollow } from "./UnFollow.mutation.graphql.js";
import { AddNote } from "./AddNote.mutation.graphql.js";
import { UpdateNote } from "./UpdateNote.mutation.graphql.js";

@customElement("ticker-detail")
export class TickerDetail extends LitElement {
    // -- State, properties etc -- //
    @property()
    location?: RouterLocation;

    // The hash map for urls
    // urlHashMap: Object = {
    //     "#summary": { menuIndex: 0, submenuIndex: null }, // e.g. index 0 of menu , no submenu
    //     "#yld0": { menuIndex: 1, submenuIndex: null },
    //     "#fundamentals": { menuIndex: 2, submenuIndex: null },
    //     "#financials": { menuIndex: 3, submenuIndex: null },
    //     "#research": { menuIndex: 4, submenuIndex: null },

    //     "#news": { menuIndex: 4, submenuIndex: 0 },
    //     "#investor-relations": { menuIndex: 4, submenuIndex: 1 },
    //     "#press-relations": { menuIndex: 4, submenuIndex: 2 },
    //     "#financial-health": { menuIndex: 4, submenuIndex: 15 },
    // };

    @query("#menu")
    menu;

    @query("#submenu")
    submenu;

    @query("generic-dialog-card")
    _addNote;

    // #yld0 -> index  ook
    // #sec_filings ->

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
    private modalOpen: boolean = false;

    @state()
    modalItem?: Object;

    @state()
    private previewModalOpen: boolean = false;

    @state()
    previewModalItem?: Object;

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

    @query(".Chart")
    chartQuerySelector!: HTMLElement;

    @state()
    chart: Object;

    @state()
    areaSeries = null;

    seriesesData = new Map([
        ["1D", null],
        ["1W", null],
        ["1M", null],
        ["1Y", null],
    ]);

    @state()
    intervals = ["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "5Y", "ALL"];

    // -- End of Chart Support -- //

    // query = new ApolloQueryController(this, GetStockAlerts, {
    //     fetchPolicy: "cache-and-network",
    //     showErrorStack: "json",
    //     variables: {
    //         symbol: this.symbol,
    //     },
    // });

    query = new ApolloQueryController(this, GetSingleStock, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
        variables: {
            symbol: this.symbol,
        },
    });

    follow = new ApolloMutationController(this, Follow);
    unFollow = new ApolloMutationController(this, UnFollow);

    // Notes
    mutation_add_note = new ApolloMutationController(this, AddNote);
    mutation_update_note = new ApolloMutationController(this, UpdateNote);

    @state()
    notesTitle: string = "";

    @state()
    notes: string = "";

    @state()
    noteValid: boolean = false;

    @state()
    editNote?: object;

    @query("#cardNoteTitle")
    _noteTitle;

    @query("#cardNoteNotes")
    _noteNotes;

    //
    //
    //
    //

    @state()
    modalChecklistRunOpen: boolean = false;

    @state()
    modalChecklistRunItem: Object;

    // -- End of Notes --

    // mutation_update_alert = new ApolloMutationController(this, UpdateAlert);
    // mutation_delete_alert = new ApolloMutationController(this, DeleteAlert);

    // -- End of properties etc -- //

    // --- Styles --- //
    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            .toolButton {
                color: var(--lumo-contrast);
                background-color: var(--lumo-contrast-5pct);
            }

            .toolButton:hover {
                color: var(--lumo-primary-color);
            }

            .iconCompare {
                transform: rotate(45deg);
            }

            .switcher {
                display: flex;
                align-items: center;
                height: 30px;
                margin-top: 8px;
                color: #2196f3;
            }

            .switcher vaadin-button {
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                padding: 6px 8px;
                font-size: 14px;
                color: #262b3e;
                background-color: transparent;
                margin-right: 8px;
            }

            .switcher vaadin-button:hover {
                background-color: #f2f3f5;
            }

            .switcher-active-item {
                text-decoration: none;
                cursor: default;
                color: #262b3e;
            }

            .switcher-active-item,
            .switcher-active-item:hover {
                background-color: #e1eff9;
            }

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

            #tabmenu {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                padding-top: 0rem;
                padding-left: 0.1rem;
                padding-right: 0.1rem;
                padding-bottom: 1.5rem;
            }

            .Chart {
                margin: 1rem;
            }

            #stockLogo {
                font-size: var(--lumo-font-size-xl);
                border-radius: 0;
                padding: 0.3rem;
            }

            #stockTicker {
                font-size: var(--lumo-font-size-xl);
            }

            /* Follow/Following Button */

            .buttonFollowing {
                color: var(--default-primary-color);
                font-size: var(--lumo-font-size-tiny);
            }

            .buttonFollow {
                color: white;
                font-size: var(--lumo-font-size-tiny);
                background-color: var(--default-primary-color);
            }

            /* End of following styles */

            .tabContent {
                padding-top: 50px;
                padding-bottom: 50px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `,
    ];
    // --- End of Styles --- //

    // -- Start of lifecycle methods -- //

    handleGoHashPath(hash: string) {
        let targetElement = this.renderRoot?.querySelector(hash);
        console.log(this, "handleGoHashPath", "targetElement", targetElement);

        function findUpTag(el, tag) {
            while (el.parentNode) {
                el = el.parentNode;
                if (el.nodeName === tag) return el;
            }
            return null;
        }
        if (targetElement) {
            // We need to set the tab menus correctly in order to show content and
            // scroll to it
            // Allow two levels up of tab menus

            const tabParent = findUpTag(targetElement, "YLD0-TAB");
            const tabsParent = findUpTag(targetElement, "YLD0-TABS");

            console.log("finding", tabParent, tabParent.getAttribute("index"));

            if (tabParent && tabsParent && tabParent.getAttribute("index")) {
                console.log("nuno ticker-detail", tabParent.getAttribute("index"));
                tabsParent.setAttribute("index", tabParent.getAttribute("index"));
            }

            const tabGrandParent = findUpTag(tabsParent, "YLD0-TAB");
            const tabsGrandParent = findUpTag(tabsParent, "YLD0-TABS");
            if (tabGrandParent && tabsGrandParent && tabGrandParent.getAttribute("index")) {
                tabsGrandParent.setAttribute("index", tabGrandParent.getAttribute("index"));
            }

            // const asada = this.renderRoot.querySelector("#submenu");
            // asada?.scrollTo(300, 0);

            // Need to allow the selected tab to be displayed before
            // scrolling to it, else it won't work
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 500);
        }
    }

    /* For non-hard refresh hash url changes */
    /* Listening for changes to the hash path and then calling the handleGoHashPath function. */
    private handleHashPath = () => {
        // `this` refers to the component
        console.log("handleHashPath", window.location.hash);
        this.handleGoHashPath(window.location.hash);
    };

    // We want to enable polling in case of updates
    connectedCallback() {
        console.log("connectedCallback");
        super.connectedCallback();
        this.query.startPolling(60000);
        console.log("connectedCallback", this.shadowRoot);
        window.addEventListener("hashchange", this.handleHashPath);
        //this.handleHashPath();
        // window.addEventListener(
        //     "hashchange",
        //     function (e) {
        //         console.log("hashchange", e, e.target.localName);
        //         //let targetElement = document.querySelector("simple-element").$[location.hash.substr(1)];
        //         let targetElement = document.querySelector("#test");
        //         Array.from(document.querySelectorAll("#test")).forEach((el: Element, i) => {
        //             console.log("hashchange target", el);
        //             el.scrollIntoView();
        //         });

        //         console.log("hashchange target", targetElement);
        //         // if (targetElement) {
        //         //     targetElement.scrollIntoView();
        //         // }
        //     },
        //     false
        // );

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
        this.createLWChart();
        this.handleGoHashPath(this.location.hash);

        console.log("nuno tickerdetail firstupdated");
    }

    update(changedProperties: PropertyValues) {
        // Hash URL support
        // if (this.location.hash && this.urlHashMap[this.location.hash]) {
        //     const { menuIndex, submenuIndex } = this.urlHashMap[this.location.hash];
        //     console.log("almost", menuIndex, submenuIndex);
        //     if (this.menu && menuIndex) {
        //         this.menu.setAttribute("index", menuIndex);
        //     }
        //     if (this.submenu && submenuIndex) {
        //         this.submenu.setAttribute("index", submenuIndex);
        //     }
        // }

        super.update(changedProperties);
    }

    // --- End of lifecycles --- //

    // -- Other functions -- //
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

        let historical_prices_1yr = [];
        Array.from(this.stock?.historical_prices_1yr).forEach((hp: Object, i) => {
            historical_prices_1yr.push({
                time: hp.date, //new Date(hp.date).getTime(),
                value: hp.close,
            });
        });

        this.seriesesData.set("1D", historical_prices_1yr);

        //this.lineSeries.setData(historical_prices_1yr);

        //this.updateChartMarkers();

        this.areaSeries = null;
        this.syncToInterval(this.intervals[0]);
    }

    private syncToInterval(interval) {
        if (this.areaSeries) {
            this.chart.removeSeries(this.areaSeries);
            this.areaSeries = null;
        }
        this.areaSeries = this.chart.addAreaSeries({
            topColor: "rgba(76, 175, 80, 0.56)",
            bottomColor: "rgba(76, 175, 80, 0.04)",
            lineColor: "rgba(76, 175, 80, 1)",
            lineWidth: 2,
        });

        console.log("inerval", this.seriesesData.get(interval), this.seriesesData);

        this.areaSeries.setData(this.seriesesData.get(interval));
    }

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

    private handleSearchSelected(e: Event) {
        console.log("handleSearchSelected", e.detail.hash);
        //const item = this.shadowRoot?.querySelector("yld0-tabs");
        //console.log(item, this.shadowRoot);

        //item.setAttribute("index", "3");

        //div:nth-child(1) > yld0-tabitem:nth-child(1)
        //div:nth-child(1)
        // Simulate a click
        //item.click();
        this.handleGoHashPath(e.detail.hash);
    }

    async handleAddNote() {
        // var data;
        // var error;
        // var loading: boolean = false;
        var notificationText;

        var { data, error, loading } = await this.mutation_add_note.mutate({
            variables: {
                symbol: this.stock.symbol,
                note: { title: this.notesTitle, notes: this.notes, price: this.stock?.price, price_number: this.stock?.price_number, checklist: null },
            },
            refetchQueries: () => [
                {
                    query: GetSingleStock,
                    variables: {
                        symbol: this.symbol,
                    },
                },
            ],
        });

        notificationText = `Added note for ${this.stock.symbol}.`;

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = notificationText;
            this.clearNote();
        }
    }

    async handleSaveNote() {
        var notificationText;

        var { data, error, loading } = await this.mutation_update_note.mutate({
            variables: {
                symbol: this.stock.symbol,
                uuid: this.editNote?.uuid,
                note: { title: this.notesTitle, notes: this.notes, checklist: null },
            },
            update: (store, {}) => {
                // Read the data from the cache for this query.
                const dataQ = store.readQuery({
                    query: GetSingleStock,
                    variables: {
                        symbol: this.stock?.symbol,
                    },
                });

                let items = this.stock?.notes.map((i) => {
                    console.log(i, this.editNote?.uuid);
                    if (i.uuid !== this.editNote?.uuid) {
                        console.log("same");
                        return i;
                    }
                    return { ...i, title: this.notesTitle, notes: this.notes, checklist: null };
                });

                const update = { ...dataQ, single_stock: { ...dataQ.single_stock, notes: items } };

                console.log("update, danvir", update);

                // Write the data back to the cache, always remember variables.
                store.writeQuery({ query: GetSingleStock, data: update, variables: { symbol: this.stock?.symbol } });
            },
        });

        notificationText = `Saved note for ${this.stock.symbol}.`;

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = notificationText;
            if (!this._addNote.sticky) {
                this._addNote.close();
            }
        }
    }

    clearNote() {
        console.log("clearNote, ", this._noteNotes);
        this._noteTitle.clear();
        this._noteNotes.clear();
    }

    /**
     * We mutate the store, so that we dont have to wait for the mutation
     * Understand the difference between update / OptimisticResponse / refetchQueries
     * be careful to include variables else you miss the cache
     */
    async handleFollow(item: Object) {
        console.log("handleFollow", `following: ${item.following}`);

        var data;
        var error;
        var loading: boolean = false;
        var notificationText;

        if (item.following) {
            // unfollow
            var { data, error, loading } = await this.unFollow.mutate({
                variables: {
                    symbol: item.symbol,
                },
                update: (store, {}) => {
                    // Read the data from the cache for this query.
                    const dataQ = store.readQuery({
                        query: GetSingleStock,
                        variables: {
                            symbol: item.symbol,
                        },
                    });

                    console.log("dataq", dataQ);

                    // Set following to false
                    const following = false;
                    const itemChanged = { ...item, following };

                    const update = { ...dataQ, single_stock: itemChanged };

                    console.log("update", update);

                    // Write the data back to the cache, always remember variables.
                    store.writeQuery({ query: GetSingleStock, data: update, variables: { symbol: item.symbol } });
                },
            });
            notificationText = `Removed ${item.symbol} to your watchlist.`;
        } else {
            var { data, error, loading } = await this.follow.mutate({
                variables: {
                    symbol: item.symbol,
                },
                update: (store, {}) => {
                    // Read the data from the cache for this query.
                    const dataQ = store.readQuery({
                        query: GetSingleStock,
                        variables: {
                            symbol: item.symbol,
                        },
                    });

                    console.log("dataq", dataQ);

                    // Set following to false
                    const following = true;
                    const itemChanged = { ...item, following };

                    const update = { ...dataQ, single_stock: itemChanged };

                    console.log("update", update);

                    // Write the data back to the cache, always remember variables.
                    store.writeQuery({ query: GetSingleStock, data: update, variables: { symbol: item.symbol } });
                },
            });

            notificationText = `Added ${item.symbol} to your watchlist.`;
        }

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = notificationText;
        }
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
        const showExpandIcon = false;
        //this.stock = this.query_stock.data?.single_stock;

        // console.log("stock", this.stock);

        const { data, options, loading, error, errors, networkStatus } = this.query;
        this.stock = data?.single_stock;

        console.debug(data, loading, error, errors, networkStatus, this.stock);

        const peers = ["NFLX"];

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
                : html` <vaadin-horizontal-layout>
                          <span>
                              <vaadin-avatar id="stockLogo" img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: var(--lumo-size-s);"></vaadin-avatar>
                          </span>
                          <span>
                              <vaadin-vertical-layout>
                                  <span id="stockTicker" class="stockSymbolBig"> ${this.stock.company_name}</span>
                                  <span class="description" style="font-size: var(--lumo-font-size-micro)">Nasdaq Global Select > ${this.stock.symbol}</span>
                                  <!-- <span class="priceBold"> ${this.stock.price}</span>
                                  <span>Company Profile</span> -->
                              </vaadin-vertical-layout>
                          </span>
                          <vaadin-vertical-layout>
                                <!-- <vaadin-horizontal-layout>
                                    <span style="margin-left: auto;">
                                        <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                            <vaadin-icon class="iconCompare" icon="vaadin:compress"></vaadin-icon>
                                            Compare
                                        </vaadin-button>
                                    </span>
                                    <span style="margin-right: auto;">
                                        <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                            <vaadin-icon size="40" icon="vaadin:chart"></vaadin-icon>
                                            Free Form Charting
                                        </vaadin-button>
                                    </span>
                                    
                                </vaadin-horizontal-layout> -->
 
                          </vaadin-vertical-layout>

                          <span style="margin-left: auto;">
                              <vaadin-button theme="theme" class='${this.stock.following ? "buttonFollowing" : "buttonFollow"}' style="margin-left: 10px;" 
                              @click="${() => {
                                  this.handleFollow(this.stock);
                              }}">
                                ${this.stock.following ? "Following" : "Follow"}
                              </vaadin-button>
                          </span>

                      </vaadin-horizontal-layout>
                      
                      <vaadin-horizontal-layout>
                        <search-in-stock style="margin-right: auto;" .companyName="${this.stock.company_name}" @search-selected=${this.handleSearchSelected}></search-in-stock>
                        <span style="margin-left: auto;">
                            <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                <vaadin-icon class="iconCompare" icon="vaadin:compress"></vaadin-icon>
                                Compare
                            </vaadin-button>
                        </span>
                        <span style="">
                            <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                <vaadin-icon size="40" icon="vaadin:chart"></vaadin-icon>
                                Free Form Charting
                            </vaadin-button>
                        </span>
                      </vaadin-horizontal-layout>

                    <section id="tabmenu">
                        <yld0-tabs id="menu">
                            <yld0-tab title="Summary">
                                <div class="Chart"></div>
                                <stock-benchmarks-card expanded .peers=${peers}></stock-benchmarks-card>
                                
                                mkldjas
                                <tool-tip bottom>This is a tooltip</tool-tip>






                              <container-card-info uniqId="summary-info">
                        <h4 style="margin-bottom: 2rem; color: var(--lumo-secondary-text-color); font-weight: 400;">
                            Checklists are a powerful tool to confirm your investment strategy. Once created, you can run them as a template by adding to your Notes.
                            <p>Running them will not only take emotion out of your decision making but confirm you have done your due diligence.</p>
                            <p>Checklists can be used to for example:</p>
                            <ul style="color: var(--lumo-secondary-text-color); font-weight: 400;">
                                <li>Check whether a stock is suitable for investment</li>
                                <li>Periodic analysis where you can confirm how the stock is changing over time.</li>
                            </ul>
                        </h4>
                    </container-card-info>





                                <stock-checklists 
                                    @add="${() => {
                                        this.modalOpen = true;
                                        this.modalItem = undefined;
                                        this.query.stopPolling();
                                    }}" 
                                    @edit="${(e) => {
                                        this.modalOpen = true;
                                        this.modalItem = e.detail.item;
                                        console.log("edit, ", this.modalItem);
                                        this.query.stopPolling();
                                    }}" 

                                    @preview="${(e) => {
                                        this.previewModalOpen = true;
                                        this.previewModalItem = e.detail.item;
                                        this.query.stopPolling();
                                    }}"
                                ></stock-checklists>




                                <stock-notes .stock=${this.stock} 
                                    @edit="${(e) => {
                                        console.log("edit", e.detail.item);
                                        this.editNote = e.detail.item;
                                        this._addNote.open = true;
                                    }}"
                                    @add-note="${() => {
                                        this._addNote.open = true;
                                    }}"
                                    @run-checklist="${(e) => {
                                        console.log("run-checklist");
                                        this.modalChecklistRunOpen = true;
                                        this.modalChecklistRunItem = e.detail.item;
                                    }}"
                                ></stock-notes> 
            

                                   

                                
                                  <!-- <home-watchlist @addvaluation-clicked=${this.handleModalOpen} @addfollow-clicked=${this.handleModalOpen}></home-watchlist> -->
                                  
                                  <!-- Main chart -->

                                  <!-- <div class="switcher">
                                      ${this.intervals.map((interval, index) => {
                                          return html`<vaadin-button theme="small">${interval}</vaadin-button>`;
                                      })}
                                  </div> -->

                                    <div id="summary">Summary</div>




                                  <a href="http://localhost:8000/stocks/NFLX#test">dsads</a>
                                  <div id="test2" style="height: 500px;">
                                 
                                
                                </div>
                                      <div id="test" style="height: 500px;">
                                    
                                      The Queen has announced she would like Camilla, the Duchess of Cornwall, to have the title of Queen Consort when the Prince of Wales becomes King.

It is an endorsement from the very top, say royal commentators - and one that is well-deserved after years of loyalty and hard work.

Prince Charles described it as a deep honour for both him and his "darling wife".

Since marrying into the Royal Family 17 years ago, Camilla, 74, has grown into her role as a senior royal.

The path to public acceptance has been at times rocky, and at first Camilla was a controversial figure who was blamed by some for the end of the prince's first marriage to Princess Diana.

In 1994, Charles admitted to adultery with Camilla, but said it came after his marriage to Diana had "irretrievably broken down".

It was not until 1999 when she and Charles went public with their romance, being photographed emerging f
                                    </div>

                              </yld0-tab>
                              <yld0-tab title="Rating">
       

                                  yld0

                                  <yld0-tabs id="submenu">
                                      <yld0-tab title="yld0 Rating">YLD0 Rating

                                        <div id="yld0-rating">yld0's rating </div>


                                        <div id="yld0-risk-check">Risk Check</div>
                                        <div id="yld0-insights">Insights</div>

                                      </yld0-tab>
                                      
                                      <yld0-tab title="Wall Street Rating">Wall Street Rating
                                        <div id="wall-street-ratings"></div>
                                        <div id="analysts-price-targets">Analysts Price Targets</div>
                                        <div id="analysts-recommendations">Analysts Recommendations</div>
                                        <div id="analysts-financial-estimates">Analysts Financial Estimates</div>
                                        <div id="analysts-analysis-of-reports">Analysts analysis of Reports</div>


                                      </yld0-tab>
                                  </yld0-tabs>

                              </yld0-tab>
                              <yld0-tab title="Fundamentals">
               
                                  <div id="fundamentals">fundamentals</div>
                                  <div id="fundamentals-valuation">valuation</div>
                                  <div id="fundamentals-growth">growth</div>
                                  <div id="fundamentals-profitability">profitability</div>
                                  Fundamentals
                              </yld0-tab>
                              <yld0-tab title="Financials">
               
                                  Financials
                                      <div id="cashflow">Cashflow</div>
                                      <div id="balance-sheet">Balance Sheet</div>
                                      <div id="income-sheet">Income Sheet</div>

                              </yld0-tab>
                              <yld0-tab title="Research">
                                
                                  <yld0-tabs id="submenuResearch">
                                      <yld0-tab title="News">
                                        <div class="tabContent" id="news">
                                            <company-news-card .stock=${this.stock}></company-news-card>
                                        </div>
                                      </yld0-tab>
                                      <yld0-tab title="Company Profile"> 
                                        <div class="tabContent" id="company-profile">
                                            <company-profile-card .stock=${this.stock}></company-profile-card>
                                        </div>
                                      </yld0-tab>


                                      <yld0-tab title="Insider Trading">
                                        <div class="tabContent" id="insider-trading">
                                            <insider-trading-card .stock=${this.stock}></insider-trading-card>
                                        </div>
                                      </yld0-tab>

                                      <yld0-tab title="Stock Profile"> 
                                        <div class="tabContent" id="stock-profile">
                                            <stock-profile-card .stock=${this.stock}></stock-profile-card>
                                        </div>
                                      </yld0-tab>
                                      <yld0-tab title="Investor Relations">
                                        <div class="tabContent" id="investor-relations">
                                                <company-investor-relations-card .stock=${this.stock}></company-investor-relations-card>
                                        </div>
                                      </yld0-tab>
                                      <yld0-tab title="Press Releases">
                                        <div class="tabContent" id="press-releases">
                                            <press-releases-card .stock=${this.stock}></press-releases-card>
                                        </div>
                                      </yld0-tab>
                                      <yld0-tab title="SEC Filings">
                                        <div class="tabContent" id="sec-filings">
                                            <sec-filings-card .stock=${this.stock}></sec-filings-card>
                                        </div>
                                      </yld0-tab>
                                      <yld0-tab title="Recent Institional Transactions">
                                        <div id="recent-institional-transactions">Recent Institional Transactions</div>
                                      </yld0-tab>
                                      <yld0-tab title="Ownership">
                                      <div id="ownership">Ownership</div>
                                      </yld0-tab>
                                      <yld0-tab title="Earnings Calls">
                                      <div id="earning-calls">Earning Calls</div>
                                      </yld0-tab>
                                      <yld0-tab title="Management">
                                          <div id="management">Management</div>
                                      </yld0-tab>


                     

                                      <!-- Executive -->
                                      <yld0-tab title="Earnings Calendar">
                                        <div id="earnings-calendar">Earnings Calendar</div>
                                      </yld0-tab>



                                      <yld0-tab title="Recent Transactions">
                                        <div id="recent-transactions">Recent Transactions</div>
                                      </yld0-tab>
                                      <!-- FUTURE: Maybe -->
                                      <!-- 
                                      <yld0-tab title="Social Sentiment">
                                        <div id="social-sentiment">Social Sentiment</div>
                                      </yld0-tab>
                                      -->
                                      <yld0-tab title="Shareholders">
                                        <div id="shareholders">Shareholders</div>
                                      </yld0-tab>
                                      <yld0-tab title="Past Performance">
                                        <div id="past-performance">Past Performance</div>
                                      </yld0-tab>
                                      <yld0-tab title="Future Growth">
                                        <div id="future-growth">Future Growth</div>
                                      </yld0-tab>
                                      <yld0-tab title="Valuation">
                                        <div id="valuation">Valuation</div>
                                      </yld0-tab>
                                      <yld0-tab title="Financial Health"> 
                                          <div id="financial-health">Financial Health</div>
                                          <financial-health></financial-health>
                                        </yld0-tab>
                                      <yld0-tab title="Dividends">
                                        <div id="dividends">Dividends</div>

                                        <stock-dividends .stock=${this.stock}></stock-dividends>

                                      </yld0-tab>
                                  </yld0-tabs>
                              </yld0-tab>
                          </yld0-tabs>
                      </section>

                      <!-- Main table data -->
                      <!-- <table class="yld0">
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
            -->

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

            <!-- add/edit checklist modal -->
            <!-- <checklist-modal
                ?add=${this.modalItem ? false : true}
                .checklist=${this.modalItem}
                ?open="${this.modalOpen}"
                @closed="${(e: CustomEvent) => {
                this.modalOpen = e.detail.value;
                this.query.startPolling(60000);
            }}"
            ></checklist-modal> -->

            <!-- preview checklist modal -->
            <run-checklist-modal
                .checklist=${this.previewModalItem}
                ?open="${this.previewModalOpen}"
                @closed="${(e: CustomEvent) => {
                    this.previewModalOpen = e.detail.value;
                    this.query.startPolling(60000);
                    this.requestUpdate();
                }}"
            ></run-checklist-modal>

            <!-- Special dialog container -->
            <generic-dialog-card
                ?add=${this.editNote?.uuid ? false : true}
                title="Note"
                @add="${this.handleAddNote}"
                @save="${this.handleSaveNote}"
                @close="${(e) => {
                    console.log("close");
                    this.noteValid = false;
                    this.editNote = null;
                }}"
                ?valid=${this.noteValid}
            >
                <div slot="header">
                    <vaadin-vertical-layout style="margin-left: auto;">
                        <span style="margin-left: auto;" class="description">${this.stock?.symbol}</span>
                        <span class="description">Current Price: ${this.stock?.price}</span>
                    </vaadin-vertical-layout>
                </div>
                <div slot="body">
                    <text-area
                        id="cardNoteTitle"
                        value=${this.editNote?.title}
                        theme="no-border no-focus-border narrow no-margin"
                        label="Title"
                        placeholder="Optional"
                        @on-change=${(e) => {
                            console.log("on-change - title");
                            this.notesTitle = e.detail.value;
                            this.noteValid = this.notesTitle ? true : false;
                        }}
                    ></text-area>
                    <text-area
                        id="cardNoteNotes"
                        value=${this.editNote?.notes}
                        theme="no-border no-focus-border long no-margin"
                        label="Notes"
                        placeholder="Add your notes"
                        @on-change=${(e) => {
                            console.log("on-change - nots");
                            this.notes = e.detail.value;
                            this.noteValid = this.notes ? true : false;
                        }}
                    ></text-area>
                    ${this.editNote
                        ? html`
                              <vaadin-horizontal-layout style="align-items: center; margin-top: auto;" theme="spacing">
                                  <span style="margin-left: auto; margin-top: auto;">
                                      <vaadin-vertical-layout style="margin-left: auto;">
                                          <span class="description">created ${formatDistance(new Date(this.editNote?.created_at), new Date(), { addSuffix: true })} </span>
                                          <span class="description">Price @ creation: ${this.editNote?.price}</span>
                                      </vaadin-vertical-layout>
                                  </span>
                              </vaadin-horizontal-layout>
                          `
                        : html``}
                </div>
            </generic-dialog-card>

            <!-- Checklist Run/Preview -->
            <y-checklist-run
                .checklist=${this.modalChecklistRunItem}
                ?open="${this.modalChecklistRunOpen}"
                @closed="${(e: CustomEvent) => {
                    this.modalChecklistRunOpen = e.detail.value;
                    this.query.startPolling(60000);
                    this.requestUpdate();
                }}"
            ></y-checklist-run>

            <y-checklist
                ?add=${this.modalItem ? false : true}
                .checklist=${this.modalItem}
                ?open="${this.modalOpen}"
                @closed="${(e: CustomEvent) => {
                    this.modalOpen = e.detail.value;
                    this.query.startPolling(60000);
                }}"
            ></y-checklist>

            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

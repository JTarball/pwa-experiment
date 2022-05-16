import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { format, setMilliseconds } from "date-fns";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { pnMetricSimple, posBgMetric, negBgMetric } from "../../../helpers/utilities/helpers.js";
import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { truncate } from "../../../helpers/utilities/helpers.js";

import { GetTopInsider } from "../../../graphql/queries/GetTopInsider.query.graphql";
import { GetBoughtSoldInsiderShares } from "../../../graphql/queries/GetBoughtSoldInsiderShares.query.graphql";

import "../../atoms/card/card";
import "../../atoms/container-list/container-list";

import "./insider-trading-chart-mini";

@customElement("insider-trading-card")
export class InsiderTradingCard extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Object })
    stock?: object;

    query = new ApolloQueryController(this, GetTopInsider, {
        fetchPolicy: "cache-and-network",
        noAutoSubscribe: true,
    });

    query_bs = new ApolloQueryController(this, GetBoughtSoldInsiderShares, {
        fetchPolicy: "cache-and-network",
        noAutoSubscribe: true,
    });

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .container-cards {
                margin-left: auto;
                margin-right: auto;
                padding-top: 50px;
                padding-bottom: 50px;
                /* display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: inline-grid; */
                align-items: center;
                justify-content: center;
                max-width: 990px;
            }

            .card-body {
                padding: 16px;
                padding-top: 0px;
            }

            #body-card {
                padding: 16px;
                padding-top: 0px;
            }

            #logo {
                border-radius: 0;
                padding: 0.3rem;
                width: 50px;
                height: 50px;
            }

            #stockCompanyName {
                padding: 10px;
                padding-top: 24px;
                padding-bottom: 0px;
            }

            #stockExchange {
                padding: 10px;
                padding-top: 0px;
            }

            .info-box {
                overflow: hidden;
            }

            .info-box .info {
                box-sizing: border-box;
                float: left;
                width: 33.3333333333%;
                padding: 0;
                min-height: 50px;
            }
            .info {
                clear: none;
            }

            .info-box .info-col-2 {
                box-sizing: border-box;
                float: left;
                width: 50%;
                padding: 0;
                min-height: 50px;
            }

            .info-box .info h4,
            .info-box .info-col-2 h4,
            h4 {
                font-size: 11px;
                line-height: 11px;
                margin-bottom: 9px;
                color: rgba(0, 0, 0, 0.5);
                margin-top: 33px;
                text-transform: none;
                font-weight: 400;
                font-family: monospace;
            }

            .info-a {
                font-size: var(--lumo-font-size-tiny);
                color: var(--lumo-primary-text-color);
                text-decoration: none;
            }

            span.accent {
                font-family: monospace;
                display: inline-block;
                width: 8%;
                color: rgba(0, 0, 0, 0.5);
                font-size: 11px;
            }

            address {
                text-decoration: none;
            }

            address span {
                display: block;
            }

            a[href^="tel"] {
                border: 1px solid #ccc;
                border-radius: 5px;
                color: black;
                display: inline-block;
                font-style: normal;
                margin-top: 10px;
                padding: 3px 5px;
                text-decoration: none;
            }

            a[href^="tel"]:before {
                content: "tel: ";
                font-weight: bold;
            }

            .pr-row {
                min-height: 50px;
            }

            .pr-date {
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-xxs);
                font-family: monospace;
            }

            .pr-title {
                padding-top: 8px;
                padding-bottom: 0px;
                font-weight: 500;
                text-align: center;
                text-decoration: none;
                font-family: monospace;
            }

            .pr-title a {
                padding-top: 8px;
                padding-bottom: 0px;
                color: var(--lumo-contrast);
                font-weight: 500;
                text-align: center;
                text-decoration: none;
            }

            .pr-title a:hover {
                text-decoration: none;
            }

            .pr-title a:visited {
                text-decoration: none;
            }

            .pr-accent-title,
            .pr-accent-title a {
                font-size: var(--lumo-font-size-m);
                color: var(--lumo-primary-text-color);
            }

            .pr-text {
                text-transform: capitalize;
                text-align: center;
                font-family: monospace;
            }

            .truncate {
                display: -webkit-box;
                max-width: 100%;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            tr[role="row"]:hover {
                background-color: var(--lumo-shade-5pct);
                cursor: pointer;
            }

            #filterButton {
                background-color: var(--lumo-shade-40pct);
                font-family: monospace;
                font-size: var(--lumo-font-size-xxs);
            }

            .topCardSubTitle {
                width: 100%;
                text-align: center;
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-xxs);
                margin-top: 0.4rem;
            }

            #bsChart {
                margin-left: auto;
                margin-right: auto;
            }
            .centerObj {
                margin-left: auto;
                margin-right: auto;
            }
        `,
    ];

    // -- Lifecycle function -- //

    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
        if (this.stock && this.stock?.symbol) {
            console.log("top_insider, firstUpdated");
            this.query.variables = { symbol: "MSFT" };
            this.query.subscribe();
            this.query.refetch();

            this.query_bs.variables = { symbol: "MSFT" };
            this.query_bs.subscribe();
            this.query_bs.refetch();
        }
    }

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        const { data, options, loading, error, errors, networkStatus } = this.query;

        const { data_bs } = this.query_bs;

        console.log("top_insider", data, error, errors, data_bs);

        const headerTopInsider = [
            {
                id: "insider_name",
                label: "Top Insider (In last 18 Months)",
                width_percentage: "75",
                noSort: true,
                template: (row: Object) => {
                    return html`
                        <vaadin-vertical-layout style="padding: 10px;">
                            <span style="text-transform: capitalize; text-align:center; margin-right: auto;">${row?.insider_name.toLowerCase()}</span>
                            <span style="text-transform: capitalize; text-align:center; margin-top: 4px; margin-right: auto; font-weight: 500;">${row?.position}</span>
                        </vaadin-vertical-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "no_of_transactions",
                label: "Transactions",
                width_percentage: "5",
                noSort: true,
            },
            {
                id: "net_change_shares",
                label: "Change",
                noSort: true,
                width_percentage: "20",
                text_align: "center",
                header_text_align: "center",
                template: (row: Object) => {
                    return html`
                        <vaadin-vertical-layout style="align-items: center;">
                            <span style="font-size: 14px;">${pnMetricSimple(row?.net_change_shares)}</span>
                            <span style="margin-left: 4px; font-size: var(--lumo-font-size-tiny);">(${this.stock?.currency_symbol}${Math.floor(row?.net_change_value)})</span>
                            <vaadin-horizontal-layout>
                                <span style="font-size: var(--lumo-font-size-tiny);">Buys: ${row?.buys}</span>
                                <span style="font-size: var(--lumo-font-size-tiny); margin-left: 4px;">Sells: ${row?.sells}</span>
                            </vaadin-horizontal-layout>
                        </vaadin-vertical-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
        ];

        const boughtSoldData = [
            { period: "Past 3 Month", bought: 28, sold: 0 },
            { period: "Past 6 Month", bought: 28, sold: 0 },
            { period: "Past 12 Month", bought: 28, sold: 0 },
            { period: "Past 18 Month", bought: 28, sold: 0 },
        ];

        const headerBoughtSold = [
            {
                id: "period",
                label: "",
                width_percentage: "75",
                noSort: true,
                text_align: "center",
                header_text_align: "center",
                template: (row: Object) => {
                    return html`
                        <vaadin-horizontal-layout>
                            <span style="text-transform: capitalize; text-align:center; margin: auto;">${row?.period.toLowerCase()}</span>
                            <span>
                                <insider-trading-chart-mini id="bsChart" symbol="${this.stock?.symbol}"></insider-trading-chart-mini>
                            </span>
                        </vaadin-horizontal-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "bought",
                label: "Bought",
                width_percentage: "15",
                noSort: true,
            },
            {
                id: "sold",
                label: "Sold",
                width_percentage: "15",
                noSort: true,
            },
        ];

        const headerCells = [
            {
                id: "date",
                label: "Date",
                width_percentage: "12",
                template: (row: Object) => {
                    return html`<span style="padding-left:8px;">${format(new Date(row.date), "dd MMM yyyy")}</span>`;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "insider_name",
                label: "Insider",
                width_percentage: "40",
                template: (row: Object) => {
                    return html`
                        <vaadin-vertical-layout>
                            <span style="text-transform: capitalize; text-align:center; margin-right: auto; font-size: 15px; font-weight:500; padding-top: 8px;"
                                >${row?.insider_name.toLowerCase()}</span
                            >
                            <span style="text-transform: capitalize; text-align:center; margin-top: 4px; margin-bottom: 4px; margin-right: auto; font-weight: 500;">${row?.position}</span>
                        </vaadin-vertical-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "acquisition_or_deposition",
                label: "Buy/Sell",
                noSort: true,
                width_percentage: "3",
                text_align: "center",
                text_size_style: "13px",
                template: (row: Object) => {
                    return html` <span style="text-align:center;">${row?.acquisition_or_deposition == "A" ? posBgMetric("Buy") : negBgMetric("Sell")}</span> `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "shares_transacted",
                label: "Shares Traded",
                width_percentage: "16",
                noSort: true,
                text_align: "center",
                template: (row: Object) => {
                    return html`
                        <vaadin-vertical-layout style="align-items: center;">
                            <span style="text-align: center; font-weight: 500; color: var(--lumo-font-contrast-color); font-size: 12px;">${row?.shares_transacted_numerize}</span>
                            <span style="text-align: center; font-size: var(--lumo-font-size-tiny);">(${row?.trade_percent}%)</span>
                        </vaadin-vertical-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "price_numerize",
                label: "Price per Share",
                width_percentage: "13",
                text_align: "center",
                text_size_style: "14px",
                noSort: true,
            },
            {
                id: "total_value_numerize",
                label: "Total Value",
                width_percentage: "12",
                text_align: "center",
                text_size_style: "14px",
            },
            // {
            //     id: "shares_after",
            //     label: "Shares After",
            //     width_percentage: "7",
            // },
            {
                id: "link",
                label: "Source",
                noSort: true,
                width_percentage: "4",
                template: (row: Object) => {
                    return html`
                        <vaadin-button theme="small" class="toolButton" @click=${this.handleAddAlertToStock}>
                            <vaadin-icon class="iconCompare" icon="vaadin:external-link"></vaadin-icon>
                        </vaadin-button>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
        ];

        // @row-clicked=${(e) => {
        //     this._accordion.open = true;
        //     this.clickedRow = e.detail.row;
        //     console.log(e.detail.row);
        // }}

        console.log(this.stock.inside_trades, "INSIDE");

        return html`
            <div class="container-cards">
                <y-card noFooter width="550" height="500" title="Top Insider Activity">
                    <div slot="preTitle">
                        <vaadin-avatar img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: 30px; border-radius: 0; padding: 0.3rem;"></vaadin-avatar>
                    </div>

                    <div slot="header">
                        <span style="margin-left: auto;">
                            <vaadin-button id="help" class="help" @click=${this.handleToggleHelp} theme="icon" aria-label="Show help"
                                ><vaadin-icon icon="vaadin:question-circle-o"></vaadin-icon>
                            </vaadin-button>
                        </span>
                    </div>

                    <div id="card-body" slot="body">
                        <vaadin-vertical-layout>
                            <container-list
                                class="centerObj"
                                width="520"
                                headerTextSizeStyle="16px"
                                rowsPerPage="5"
                                rowSelectable
                                noBorder
                                noHeader
                                noFooter
                                optionalFooter
                                .headerCells=${headerTopInsider}
                                .items=${data?.top_insider}
                            >
                                <div slot="topCorner">
                                    <span style="margin-left: auto;">
                                        <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                            <vaadin-icon class="iconCompare" icon="vaadin:external-link"></vaadin-icon>
                                        </vaadin-button>
                                    </span>
                                </div>
                            </container-list>
                        </vaadin-vertical-layout>
                    </div>
                </y-card>
                <!-- 
                <y-card noFooter width="550" height="450" title="${this.stock?.symbol} Bought vs Sold">
                    <div slot="preTitle">
                        <vaadin-avatar img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: 30px; border-radius: 0; padding: 0.3rem;"></vaadin-avatar>
                    </div>

                    <div slot="header">
                        <span style="margin-left: auto;">
                            <vaadin-button id="help" class="help" @click=${this.handleToggleHelp} theme="icon" aria-label="Show help"
                                ><vaadin-icon icon="vaadin:question-circle-o"></vaadin-icon>
                            </vaadin-button>
                        </span>
                    </div>

                    <div id="card-body" slot="body">
                        <insider-trading-chart-mini id="bsChart" symbol="${this.stock?.symbol}"></insider-trading-chart-mini>
                    </div>
                </y-card> -->

                <y-card noFooter width="550" height="600" title="${this.stock?.symbol} Bought vs Sold">
                    <div slot="preTitle">
                        <vaadin-avatar img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: 30px; border-radius: 0; padding: 0.3rem;"></vaadin-avatar>
                    </div>

                    <div slot="header">
                        <span style="margin-left: auto;">
                            <vaadin-button id="help" class="help" @click=${this.handleToggleHelp} theme="icon" aria-label="Show help"
                                ><vaadin-icon icon="vaadin:question-circle-o"></vaadin-icon>
                            </vaadin-button>
                        </span>
                    </div>

                    <div id="card-body" slot="body">
                        <vaadin-vertical-layout>
                            <container-list
                                class="centerObj"
                                width="520"
                                headerTextSizeStyle="16px"
                                rowsPerPage="5"
                                rowSelectable
                                noBorder
                                noHeader
                                noFooter
                                optionalFooter
                                .headerCells=${headerBoughtSold}
                                .items=${boughtSoldData}
                            >
                                <div slot="topCorner">
                                    <span style="margin-left: auto;">
                                        <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                            <vaadin-icon class="iconCompare" icon="vaadin:external-link"></vaadin-icon>
                                        </vaadin-button>
                                    </span>
                                </div>
                            </container-list>
                        </vaadin-vertical-layout>
                    </div>
                </y-card>

                <y-card noFooter width="980" title="${this.stock?.symbol} Recent Insider Transactions">
                    <div slot="preTitle">
                        <vaadin-avatar img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: 30px; border-radius: 0; padding: 0.3rem;"></vaadin-avatar>
                    </div>

                    <div slot="header">
                        <span style="margin-left: auto;">
                            <vaadin-button id="help" class="help" @click=${this.handleToggleHelp} theme="icon" aria-label="Show help"
                                ><vaadin-icon icon="vaadin:question-circle-o"></vaadin-icon>
                            </vaadin-button>
                        </span>
                    </div>

                    <div id="card-body" slot="body">
                        <container-list
                            width="950"
                            title="Insider Trading"
                            subtitle="Recent ${this.stock?.symbol} inside trades."
                            rowsPerPage="10"
                            rowSelectable
                            noHeader
                            noBorder
                            headerTextSizeStyle="16px"
                            .headerCells=${headerCells}
                            .items=${this.stock?.inside_trades}
                        >
                            <div slot="topCorner">
                                <span style="margin-left: auto;">
                                    <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                        <vaadin-icon class="iconCompare" icon="vaadin:external-link"></vaadin-icon>
                                    </vaadin-button>
                                </span>
                            </div>
                        </container-list>
                    </div>
                </y-card>
            </div>
        `;
    }
}

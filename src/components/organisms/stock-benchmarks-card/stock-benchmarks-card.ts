import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";
import "@spectrum-web-components/tooltip/sp-tooltip.js";

import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { truncate, pnMetric } from "../../../helpers/utilities/helpers.js";
import { renderLoading } from "../../../../helpers/utilities/graphql_helpers.js";
import { formatError, dialogGraphError } from "../../../../helpers/dialog-graphql-error";
import "../../molecules/yld0-simple-message-box/message-box";
import { goPath } from "../../../router/index.js";

// import { GetChecklists } from "./GetChecklists.query.graphql.js";
// import { AddChecklist } from "./AddChecklist.mutation.graphql.js";

//import { DeleteNote } from "./DeleteNote.mutation.graphql.js";

import "../../atoms/container-list/container-list";
import "../../atoms/container-accordion/container-accordion";
import "../../atoms/delete-confirm/delete-confirm";
import "../../atoms/notification/notification";
import "../../atoms/toggle-button/toggle-button";
import "../../atoms/tool-tip/tool-tip";
import { GetPeersStocks } from "../../../graphql/queries/GetPeersStocks.query.graphql";

@customElement("stock-benchmarks-card")
export class StockBenchmarksCard extends LitElement {
    // -- State, properties etc -- //

    @property({ type: Array })
    peers: Array; // A list of symbols

    query = new ApolloQueryController(this, GetPeersStocks, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
        variables: {
            symbols: ["NFLX", "TSLA", "MSFT", "AMD", "DIS", "GOOGL", "NDVA", "BABA.SW", "ATVI"],
        },
    });

    @state()
    private items?;

    @property({ type: Object })
    stock: Object;

    @state()
    showLoading: Boolean = false;

    // -- Confirm Dialog -- //

    @state()
    confirmDialogOpen = false;

    @state()
    confirmDialogItem: Object;

    // ---- Generic Notification

    @state()
    notificationOpened = false;

    @state()
    notificationText: string = "";

    @state()
    openAddNote: boolean = false;

    @state()
    selectedSectorToggle: boolean = false;

    @query("add-note")
    _addNote;

    @query("container-list")
    _containerList;

    @query("container-accordion")
    _accordion;

    // -- Accordion -- //
    @state()
    openAccordion: boolean = false;

    @state()
    clickedRow: Object;

    // query = new ApolloQueryController(this, GetChecklists, {
    //     fetchPolicy: "cache-and-network",
    //     showErrorStack: "json",
    // });

    //mutation_add_checklist = new ApolloMutationController(this, AddChecklist);
    //mutation_delete_note = new ApolloMutationController(this, DeleteNote);

    // -- End of properties etc -- //

    // --- Styles --- //
    static styles = [
        themeStyles, // Table styling and a few extras
        css`
            .containerButton {
                font-size: var(--lumo-font-size-xxs);
                background-color: var(--lumo-shade-50pct);
            }
        `,
    ];
    // --- End of Styles --- //

    // -- Lifecyle functions -- //

    // firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    //    this.query.variables = {symbols: ['NFLX', 'TSLA']};
    //    this.query.refetch();
    // }

    // -- Handle Functions -- //

    handleRunChecklist() {
        var event = new CustomEvent("run-checklist", {});
        this.dispatchEvent(event);
    }

    async handleDeleteNote(item: Object) {
        const { data, error, loading } = await this.mutation_delete_note.mutate({
            variables: {
                symbol: this.stock?.symbol,
                uuid: item.uuid,
            },
            update: (store, {}) => {
                // Read the data from the cache for this query.
                const dataQ = store.readQuery({
                    query: GetSingleStock,
                    variables: {
                        symbol: this.stock?.symbol,
                    },
                });
                const items = this.stock.notes.filter((n) => n.uuid !== item.uuid);
                const update = { ...dataQ, single_stock: { ...dataQ.single_stock, notes: items } };

                console.log("update items", items, update, items.length);

                // Write the data back to the cache.
                store.writeQuery({ query: GetSingleStock, variables: { symbol: this.stock?.symbol }, data: update });
            },
        });
        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = "Deleted note.";
        }
    }

    renderVsIndustry() {
        return html`
            <container-list
                width="350"
                title="Benchmarks"
                subtitle="Comparison against peers or industry."
                rowsPerPage="8"
                expanded
                optionalFooter
                rowClickable
                ?showExpandIcon="${showExpandIcon}"
                .headerCells=${headerCells}
                .items=${this.items}
                @row-clicked=${(e) => {
                    this._accordion.open = true;
                    this.clickedRow = e.detail.row;
                    console.log(e.detail.row);
                }}
            >
                <div slot="topCorner">
                    <vaadin-horizontal-layout>
                        <span style="margin-right:auto; margin-left: 1rem;">
                            <toggle-button outline theme="small" id="adasdas">industry/sector view</toggle-button>
                        </span>

                        <span style="margin-left: auto;">
                            <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                <vaadin-icon class="iconCompare" icon="vaadin:external-link"></vaadin-icon>
                                Peers Compare
                            </vaadin-button>
                        </span>
                    </vaadin-horizontal-layout>
                </div>

                <div slot="preTable" style="padding-left: 1rem; padding-right: 1rem;">
                    <!-- <vaadin-horizontal-layout>
                <span style="margin-right:auto; margin-left: 1rem;">
                    <toggle-button outline theme="small" id="adasdas">industry/sector view</toggle-button>
                </span>
            </vaadin-horizontal-layout> -->
                    <container-accordion height="320" .boundaryElement=${this._containerList}>
                        <vaadin-horizontal-layout style="align-items: center; padding: 0.6rem;" theme="spacing">
                            <vaadin-avatar img="${this.clickedRow?.logo_url}" name="${this.clickedRow?.symbol}" theme="xsmall"></vaadin-avatar>
                            <span>${this.clickedRow?.company_name}</span>
                            <span style="margin-left:auto;">
                                <vaadin-button
                                    theme="small"
                                    class="toolButton"
                                    style="margin-left: 10px;"
                                    @click="${() => {
                                        goPath(`/stocks/${this.clickedRow?.symbol}`);
                                    }}"
                                >
                                    <vaadin-icon icon="vaadin:external-link"></vaadin-icon>
                                    Go to ${this.clickedRow?.symbol}
                                </vaadin-button>
                            </span>
                        </vaadin-horizontal-layout>

                        <p>${truncate(this.clickedRow?.description, 300)}</p>
                        <vaadin-horizontal-layout style="align-items: center; padding: 0.2rem; margin-bottom: 1rem;" theme="spacing">
                            <vaadin-vertical-layout>
                                <span class="metricContainer"><span class="metricHdr">Trailing P/E Ratio:</span>${pnMetric(21.0, 21.0)}</span>
                                <span class="metricContainer"><span class="metricHdr">Trailing PEG Ratio:</span>${pnMetric(20.0 < 22.0, 21.0)}</span>

                                <span class="metricContainer"><span class="metricHdr">Forward P/E Ratio:</span>${pnMetric(21.0, 21.0)}</span>
                                <span class="metricContainer"><span class="metricHdr">Forward PEG Ratio:</span>${pnMetric(20.0 < 22.0, 21.0)}</span>
                            </vaadin-vertical-layout>
                            <vaadin-vertical-layout style="margin-left:auto;">
                                <span style="margin: 0.3rem; width: 250px;"><span style="font-weight: 500;">Industry:</span> Industrials</span>
                                <span style="margin: 0.3rem; width: 250px;"><span style="font-weight: 500;">Sector:</span> Aerospace & Defense</span>
                                <span style="margin: 0.3rem; width: 250px;"><span style="font-weight: 500;">Market Cap:</span> 10.2B</span>
                            </vaadin-vertical-layout>
                        </vaadin-horizontal-layout>

                        <span style="font-weight: 500;">Return (Total):</span>
                        <vaadin-horizontal-layout style="align-items: center; margin-top: 1rem; margin-bottom: 1rem;" theme="spacing">
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">1m</span>21%</span>
                            <span class="percentDown"><span style="font-weight: 500;margin-right: 0.5rem;">3m</span>-21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">6m</span>21%</span>
                            <!-- <span ><span style="font-weight: 500;margin-right: 0.5rem">9m</span> 21%</span> -->
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">YTD</span>21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">1yr</span>21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">5yr</span>21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">10yr</span>2331%</span>
                        </vaadin-horizontal-layout>
                    </container-accordion>
                </div>

                <div style="margin: 1rem;"></div>
            </container-list>
        `;
    }

    // -- Main Render -- //
    render() {
        // this.query.variables = {'symbols': this.peers};
        const { data, options, loading, error, errors, networkStatus } = this.query;
        this.items = data?.stocks.items || [];

        console.log("stocks-benchmarks-card", data);

        // this.items = this.stock.notes || [];
        // console.log("stock-notes,", this.stock, this.items);

        const headerCells = [
            {
                id: "logo_url",
                label: "",
                noSort: true,
                width_percentage: "9",
                template: (row: Object) => {
                    return html`
                        <vaadin-horizontal-layout style="align-items: center; padding: 0.6rem;" theme="spacing">
                            <vaadin-avatar img="${row["logo_url"]}" name="${row["symbol"]}" theme="xsmall"></vaadin-avatar>
                        </vaadin-horizontal-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "symbol",
                label: "",
                noSort: true,
                width_percentage: "52",
                auto_truncate: true,
                text_size_style: "14px",
                text_align: "right",
                template: (row: Object) => {
                    return html`
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span class="stockSymbol">${row["symbol"]} </span>
                            <span class="companyName"> ${row["country"]} ${row["company_name"]} </span>
                        </vaadin-vertical-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "market_cap_numerize",
                sort_id: "market_cap",
                label: "Market Cap",
                width_percentage: "13",
                auto_truncate: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
            {
                id: "price",
                label: "Price",
                width_percentage: "10",
                auto_truncate: true,
                noSort: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
            {
                id: "dcf_price",
                label: "Instrinic Value",
                width_percentage: "26",
                auto_truncate: true,
                noSort: true,
                text_align: "right",
                header_text_align: "center",
                visible_only_when_expanded: true,
                template: (row: Object) => {
                    return html`
                        <vaadin-vertical-layout style="align-items: center; line-height: var(--lumo-line-height-m);">
                            <span style="padding: 0.1rem;">${row["dcf_price"]}</span>
                            ${row["dcf_diff_percentage_number"] > 1 || row["dcf_diff_percentage_number"] < -1
                                ? html`
                                      <span theme="badge ${row["dcf_diff_percentage_number"] > 0 ? "error" : ""} " style="font-size: 9px;"
                                          >${row["dcf_diff_percentage_number"] > 0 ? `${row["dcf_diff_percentage"]} overvalued` : `${row["dcf_diff_percentage"]} undervalued`}</span
                                      >
                                  `
                                : html``}
                        </vaadin-vertical-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
        ];

        const headerCellsSector = [
            {
                id: "market_cap_numerize",
                sort_id: "market_cap",
                label: "Metric",
                width_percentage: "15",
                auto_truncate: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
            {
                id: "market_cap_numerize",
                sort_id: "market_cap",
                label: "Symbol",
                width_percentage: "15",
                auto_truncate: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
            {
                id: "market_cap_numerize",
                sort_id: "market_cap",
                label: "Peers",
                width_percentage: "15",
                auto_truncate: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
            {
                id: "market_cap_numerize",
                sort_id: "market_cap",
                label: "Sector",
                width_percentage: "15",
                auto_truncate: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
            {
                id: "market_cap_numerize",
                sort_id: "market_cap",
                label: "Industry",
                width_percentage: "15",
                auto_truncate: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
        ];

        const showExpandIcon = false;

        // Toggle data based f
        const clData = this.selectedSectorToggle ? [] : this.items;
        const clCells = this.selectedSectorToggle ? headerCellsSector : headerCells;

        return html`
            <container-list
                width="350"
                title="Benchmarks"
                subtitle="Comparison against peers or industry."
                rowsPerPage="8"
                expanded
                optionalFooter
                rowClickable
                ?showExpandIcon="${showExpandIcon}"
                .headerCells=${clCells}
                .items=${clData}
                @row-clicked=${(e) => {
                    this._accordion.open = true;
                    this.clickedRow = e.detail.row;
                    console.log(e.detail.row);
                }}
            >
                <div slot="topCorner">
                    <vaadin-horizontal-layout>
                        <span style="margin-right:auto; margin-left: 1rem;">
                            <toggle-button
                                outline
                                theme="small"
                                id="sectorViewToggle"
                                @selected-changed="${(e) => {
                                    this.selectedSectorToggle = e.detail.selected;
                                }}"
                                >industry/sector view</toggle-button
                            >
                        </span>

                        <span style="margin-left: auto;">
                            <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                <vaadin-icon class="iconCompare" icon="vaadin:external-link"></vaadin-icon>
                                Peers Compare
                            </vaadin-button>
                        </span>
                    </vaadin-horizontal-layout>
                </div>

                <div slot="preTable" style="padding-left: 1rem; padding-right: 1rem;">
                    <!-- <vaadin-horizontal-layout>
                        <span style="margin-right:auto; margin-left: 1rem;">
                            <toggle-button outline theme="small" id="adasdas">industry/sector view</toggle-button>
                        </span>
                    </vaadin-horizontal-layout> -->
                    <container-accordion height="280" .boundaryElement=${this._containerList}>
                        <vaadin-horizontal-layout style="align-items: center; padding: 0.6rem;" theme="spacing">
                            <vaadin-avatar img="${this.clickedRow?.logo_url}" name="${this.clickedRow?.symbol}" theme="xsmall"></vaadin-avatar>
                            <span>${this.clickedRow?.company_name}</span>
                            <span style="margin-left:auto;">
                                <vaadin-button
                                    theme="small"
                                    class="toolButton"
                                    style="margin-left: 10px;"
                                    @click="${() => {
                                        goPath(`/stocks/${this.clickedRow?.symbol}`);
                                    }}"
                                >
                                    <vaadin-icon icon="vaadin:external-link"></vaadin-icon>
                                    Go to ${this.clickedRow?.symbol}
                                </vaadin-button>
                            </span>
                        </vaadin-horizontal-layout>

                        <p>${truncate(this.clickedRow?.description, 300)}</p>
                        <vaadin-horizontal-layout style="align-items: center; padding: 0.2rem;" theme="spacing">
                            <!-- <vaadin-vertical-layout>
                                <span class="metricContainer"><span class="metricHdr">Trailing P/E Ratio:</span>${pnMetric(21.0, 21.0)}</span>
                                <span class="metricContainer"><span class="metricHdr">Trailing PEG Ratio:</span>${pnMetric(20.0 < 22.0, 21.0)}</span>

                                <span class="metricContainer"><span class="metricHdr">Forward P/E Ratio:</span>${pnMetric(21.0, 21.0)}</span>
                                <span class="metricContainer"><span class="metricHdr">Forward PEG Ratio:</span>${pnMetric(20.0 < 22.0, 21.0)}</span>
                            </vaadin-vertical-layout> -->
                            <vaadin-vertical-layout style="margin-left:auto;">
                                <span style="margin: 0.3rem; width: 250px;"><span style="font-weight: 500;">Industry:</span> Industrials</span>
                                <span style="margin: 0.3rem; width: 250px;"><span style="font-weight: 500;">Sector:</span> Aerospace & Defense</span>
                                <span style="margin: 0.3rem; width: 250px;"><span style="font-weight: 500;">Market Cap:</span> 10.2B</span>
                            </vaadin-vertical-layout>
                        </vaadin-horizontal-layout>

                        <span style="font-weight: 500;">Return (Total):</span>
                        <vaadin-horizontal-layout style="align-items: center; margin-top: 1rem; margin-bottom: 1rem;" theme="spacing">
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">1m</span>21%</span>
                            <span class="percentDown"><span style="font-weight: 500;margin-right: 0.5rem;">3m</span>-21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">6m</span>21%</span>
                            <!-- <span ><span style="font-weight: 500;margin-right: 0.5rem">9m</span> 21%</span> -->
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">YTD</span>21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">1yr</span>21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">5yr</span>21%</span>
                            <span class="percentUp"><span style="font-weight: 500;margin-right: 0.5rem">10yr</span>2331%</span>
                        </vaadin-horizontal-layout>
                    </container-accordion>
                </div>

                <div style="margin: 1rem;"></div>
            </container-list>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- delete dialog -->
            <delete-confirm
                header="You're about to delete a note"
                description="Are you sure? The following action is permanent and cannot be undone."
                ?open=${this.confirmDialogOpen}
                .contextItem=${this.confirmDialogItem}
                @confirm=${async (e) => {
                    console.log("confirm");
                    this.confirmDialogOpen = false;
                    await this.handleDeleteNote(e.detail.value);
                }}
                @cancel=${() => {
                    console.log("cancel");
                    this.confirmDialogOpen = false;
                }}
            ></delete-confirm>

            <!-- Generic Notifications -->
            <generic-notification
                ?opened=${this.notificationOpened}
                .text="${this.notificationText}"
                @opened-changed="${(e: NotificationOpenedChangedEvent) => {
                    this.notificationOpened = e.detail.value;
                }}"
            ></generic-notification>
        `;
    }
}

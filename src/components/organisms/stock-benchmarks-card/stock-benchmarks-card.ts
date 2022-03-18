import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";
import "@spectrum-web-components/tooltip/sp-tooltip.js";

import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { truncate } from "../../../helpers/utilities/helpers.js";
import { renderLoading } from "../../../../helpers/utilities/graphql_helpers.js";
import { formatError, dialogGraphError } from "../../../../helpers/dialog-graphql-error";
import "../../molecules/yld0-simple-message-box/message-box";

// import { GetChecklists } from "./GetChecklists.query.graphql.js";
// import { AddChecklist } from "./AddChecklist.mutation.graphql.js";

//import { DeleteNote } from "./DeleteNote.mutation.graphql.js";

import "../../atoms/container-list/container-list";
import "../../atoms/delete-confirm/delete-confirm";
import "../../atoms/notification/notification";
import "../../atoms/tool-tip/tool-tip";
import { GetPeersStocks } from "../../../graphql/queries/GetPeersStocks.query.graphql.ts";

@customElement("stock-benchmarks-card")
export class StockBenchmarksCard extends LitElement {
    // -- State, properties etc -- //

    @property({ type: Array })
    peers: Array; // A list of symbols

    query = new ApolloQueryController(this, GetPeersStocks, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
        variables: {
            symbols: ["NFLX", "TSLA", "MSFT", "AMD", "DIS", "GOOGL", "NDVA"],
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

    @query("add-note")
    _addNote;

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
                width_percentage: "10",
                template: (row: Object) => {
                    return html`
                        <tool-tip><p>adlkjhsdkj fhasbjfshjabvds bjavbhdjsbv jbdsjhavb j dsbahjvbdsjhbvj hdsbvhdsjahv</p></tool-tip>
                        <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
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
                width_percentage: "60",
                auto_truncate: true,
                text_size: "12px",
                text_align: "right",
                template: (row: Object) => {
                    return html`
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span class="stockSymbol">${row["symbol"]} </span>
                            <span class="companyName">
                                <!-- <tool-tip width="300" .text="${row["country"]} ${row["company_name"]}">${truncate(row["description"], 150)}</tool-tip> -->
                                ${row["country"]} ${row["company_name"]}
                            </span>
                        </vaadin-vertical-layout>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "market_cap",
                label: "Market Cap",
                width_percentage: "10",
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
                id: "price",
                label: "Instrinic Value",
                width_percentage: "10",
                auto_truncate: true,
                noSort: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
        ];

        const showExpandIcon = false;

        return html`
            <container-list
                width="350"
                height="550"
                title="Benchmarks"
                subtitle="Comparison against peers or industry."
                rowsPerPage="8"
                expanded
                optionalFooter
                ?showExpandIcon="${showExpandIcon}"
                .headerItems="${["name", "description"]}"
                .headerCells=${headerCells}
                .items=${this.items}
            >
                <div slot="header">
                    <vaadin-horizontal-layout>
                        <span style="margin-left: auto;">
                            <vaadin-button theme="small" class="toolButton" style="margin-left: 10px;" @click=${this.handleAddAlertToStock}>
                                <vaadin-icon class="iconCompare" icon="vaadin:external-link"></vaadin-icon>
                                Peers Compare
                            </vaadin-button>
                        </span>
                    </vaadin-horizontal-layout>
                </div>

                <!-- <div>
                    <div
                        style="
                        margin-top: 1rem;
                        padding: 1rem;
                        border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: var(--lumo-contrast-10pct);
                    
                    "
                    >
                        <vaadin-vertical-layout>
                            <span class="title">Description</span>
                           

                            <span>Description</span>
                            <span> Netflix, Inc. provides entertainment services. It offers TV series, documentaries, feature films, and mobile games across various genres and languages. </span>
                            <vaadin-horizontal-layout>
                                <span>Market Cap</span>
                                <span>P/E</span>
                            </vaadin-horizontal-layout>
                        </vaadin-vertical-layout>
                    </div>
                </div> -->
                <div slot="footer"></div>
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

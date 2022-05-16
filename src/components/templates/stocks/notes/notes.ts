import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";

import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";

import { themeStyles } from "../../../../themes/yld0-theme/styles.js";
import { renderLoading } from "../../../../helpers/utilities/graphql_helpers.js";
import { formatError, dialogGraphError } from "../../../../helpers/dialog-graphql-error";
import "../../../molecules/yld0-simple-message-box/message-box";

// import { GetChecklists } from "./GetChecklists.query.graphql.js";
// import { AddChecklist } from "./AddChecklist.mutation.graphql.js";
import { GetSingleStock } from "../GetSingleStock.query.graphql.js";
import { DeleteNote } from "./DeleteNote.mutation.graphql.js";

import "../../../atoms/container-list/container-list";
import "../../../atoms/delete-confirm/delete-confirm";
import "../../../atoms/notification/notification";

@customElement("stock-notes")
class StockNotes extends LitElement {
    // -- State, properties etc -- //

    @property({ type: Object })
    stock: Object;

    @state()
    private items?;

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
    mutation_delete_note = new ApolloMutationController(this, DeleteNote);

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
        this.items = this.stock.notes || [];
        console.log("stock-notes,", this.stock, this.items);

        const headerCells = [
            {
                id: "created_at",
                label: "Created at",
                width_percentage: "25",
                auto_truncate: true,
                text_size_style: "9px",
            },
            {
                id: "notes",
                label: "Note",
                template: (row: Object) => {
                    const edit = () => {
                        var event = new CustomEvent("edit", { detail: { item: row } });
                        this.dispatchEvent(event);
                    };

                    return html`<div><span style="cursor:pointer; text-decoration: underline;" @click="${edit}">${row["title"] ? row["title"] : row["notes"]}</span></div>`;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
                width_percentage: "59",
            },
            {
                id: "price",
                label: "Price @ creation",
                width_percentage: "15",
                auto_truncate: true,
                noSort: true,
                text_align: "right",
                visible_only_when_expanded: true,
            },
            {
                id: "action",
                label: "",
                noSort: true,
                template: (row: Object) => {
                    console.log("template", row);

                    function createItem() {
                        const item = document.createElement("vaadin-context-menu-item");
                        const icon = document.createElement("vaadin-icon");
                        item.setAttribute("aria-label", "Other save options");
                        icon.setAttribute("icon", `vaadin:ellipsis-dots-v`);
                        item.appendChild(icon);
                        return item;
                    }

                    const handleMenuAction = (e: Event, row: Object) => {
                        console.log("handleMenuAction", e.detail.value);
                        const value = e.detail.value;

                        if (value.text == "Delete") {
                            this.confirmDialogOpen = true;
                            this.confirmDialogItem = row;
                        } else if (value.text == "Edit") {
                            var event = new CustomEvent("edit", { detail: { item: row } });
                            this.dispatchEvent(event);
                        }
                    };

                    var items = [
                        {
                            component: createItem(),
                            children: [{ text: "Edit" }, { text: "Delete" }],
                        },
                    ];
                    return html` <vaadin-menu-bar style="z-index: -1;" theme="icon" .items="${items}" @item-selected=${(e) => handleMenuAction(e, row)}></vaadin-menu-bar>`;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
                width_percentage: "1",
            },
        ];

        return html`
            <container-list
                width="350"
                height="450"
                title="Your Notes"
                subtitle="Add analysis notes or run checklists."
                .headerItems="${["name", "description"]}"
                .headerCells=${headerCells}
                .items=${this.items}
            >
                <div slot="footer">
                    <vaadin-button
                        class="containerButton"
                        @click="${() => {
                            var event = new CustomEvent("add-note", { detail: {} });
                            this.dispatchEvent(event);
                        }}"
                        theme="primary contrast"
                        >Add</vaadin-button
                    >
                    <vaadin-button class="containerButton" @click="${this.handleRunChecklist}" theme="primary contrast">Run Checklist</vaadin-button>
                </div>
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

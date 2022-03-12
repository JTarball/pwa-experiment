import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";

import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { renderLoading } from "../../../helpers/utilities/graphql_helpers.js";
import { formatError, dialogGraphError } from "../../../helpers/dialog-graphql-error";
import "../../yld0-simple-message-box/message-box";

import { GetChecklists } from "./GetChecklists.query.graphql.js";
import { AddChecklist } from "./AddChecklist.mutation.graphql.js";
import { DeleteChecklist } from "./DeleteChecklist.mutation.graphql.js";

import "../../generic/container-list/container-list";
import "../../generic/delete-confirm";
import "../../generic/notification";

@customElement("stock-checklists")
class StockChecklists extends LitElement {
    // -- State, properties etc -- //

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
    private items?;

    query = new ApolloQueryController(this, GetChecklists, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
    });

    mutation_add_checklist = new ApolloMutationController(this, AddChecklist);
    mutation_delete_checklist = new ApolloMutationController(this, DeleteChecklist);

    // -- End of properties etc -- //

    // --- Styles --- //
    static styles = [
        themeStyles, // Table styling and a few extras
        css`
            .containerButton {
                background-color: var(--lumo-shade-50pct);
            }
        `,
    ];
    // --- End of Styles --- //

    // -- Handle Functions -- //

    handleAddChecklist() {
        //console.debug("handleAddChecklist");
        var event = new CustomEvent("add", {});
        this.dispatchEvent(event);
    }

    async handleDeleteChecklist(item: Object) {
        const { data, error, loading } = await this.mutation_delete_checklist.mutate({
            variables: {
                uuid: item.uuid,
            },
            update: (store, {}) => {
                // Read the data from the cache for this query.
                const dataQ = store.readQuery({
                    query: GetChecklists,
                });
                const items = this.items.filter((i) => i.uuid !== item.uuid);
                const update = { ...dataQ, checklists: { ...dataQ.checklists, items } };

                console.log("update items", items, update, items.length);

                // Write the data back to the cache.
                store.writeQuery({ query: GetChecklists, data: update });
            },
        });
        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = "Deleted checklist.";
        }
    }

    // -- Main Render -- //
    render() {
        const { data, options, loading, error, errors, networkStatus } = this.query;
        this.items = data?.checklists.items;
        //console.debug("render checklists", data, loading, error, errors, networkStatus, this.items);

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

        const headerCells = [
            {
                id: "name",
                label: "Name",
                template: (row: Object) => {
                    const edit = () => {
                        var event = new CustomEvent("edit", { detail: { item: row } });
                        this.dispatchEvent(event);
                    };

                    return html`<div><span style="cursor:pointer; text-decoration: underline;" @click="${edit}">${row["name"]}</span></div>`;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
                width_percentage: "50",
            },
            {
                id: "description",
                label: "Description",
                width_percentage: "48",
                auto_truncate: true,
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
                        } else if (value.text == "Preview") {
                            var event = new CustomEvent("preview", { detail: { item: row } });
                            this.dispatchEvent(event);
                        }
                    };

                    var items = [
                        {
                            component: createItem(),
                            children: [{ text: "Preview" }, { text: "Edit" }, { text: "Delete" }],
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
            ${this.items?.length == 0
                ? html`
                      <message-box loaded boxImg="" boxTitle="No checklists" boxSubtitle="Checklists are mental models to power your decision making." help="">
                          <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                              <vaadin-button @click="${this.handleAddChecklist}" theme="primary contrast">Add</vaadin-button>
                          </vaadin-horizontal-layout>
                      </message-box>
                  `
                : html`
                      <container-list
                          width="350"
                          height="450"
                          title="Checklists"
                          subtitle="Mental models for due diligence."
                          .headerItems="${["name", "description"]}"
                          .headerCells=${headerCells}
                          .items=${this.items}
                      >
                          <div slot="footer">
                              <vaadin-button class="containerButton" @click="${this.handleAddChecklist}" theme="primary contrast">Add</vaadin-button>
                          </div>
                      </container-list>
                  `}
            <!-- slot, just in case -->
            <slot></slot>

            <!-- delete dialog -->
            <delete-confirm
                header="You're about to delete a checklist"
                description="Are you sure you want to delete the checklist '${this.confirmDialogItem?.name}'? The following action is permanent and cannot be undone."
                ?open=${this.confirmDialogOpen}
                .contextItem=${this.confirmDialogItem}
                @confirm=${async (e) => {
                    console.log("confirm");
                    this.confirmDialogOpen = false;
                    await this.handleDeleteChecklist(e.detail.value);
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

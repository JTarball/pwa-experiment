/* Full Page Modal */

import { LitElement, html, css, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { guard } from "lit/directives/guard.js";

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

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { UserStock, UserStockAlert } from "../store/models.js";

import "./add-alert-modal";

@customElement("alerts-stock")
class YLD0AlertsStock extends LitElement {
    /* Properties, states etc. */
    @state()
    private minimalMode: Boolean = false;

    @state()
    private stock?: UserStock;

    @state()
    private dialogOpened = false;

    @property()
    private dialogItem?: UserStockAlert;

    @state()
    private items_stocks?: UserStockAlert[];

    @state()
    private modalOpen: Boolean = false;

    // End of properties ...

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            table {
                margin-top: 0px;
            }
            vaadin-list-box {
                font-weight: 200;
            }

            #addToWatch {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
            }

            #viewmodes {
                float: right;
                position: sticky;
                min-height: 30px;
            }

            paper-toggle-button.yld0-toggle {
                --paper-toggle-button-checked-bar-color: var(--paper-green-500);
                --paper-toggle-button-checked-button-color: var(--paper-green-500);
                --paper-toggle-button-checked-ink-color: var(--paper-green-500);
                --paper-toggle-button-unchecked-bar-color: var(--secondary-text-color);
                --paper-toggle-button-unchecked-button-color: var(--divider-color);
                --paper-toggle-button-unchecked-ink-color: var(--secondary-text-color);
            }

            /* Modal Input Fields */
            textarea {
                width: 100%;
            }

            /* vaadin-context-menu-item {
                z-index: -1;
            } */
        `,
    ];

    async firstUpdated() {
        const stock = {
            symbol: "SONO",
            logoUrl: "https://logo.clearbit.com/sonos.com",
            companyName: "Sonos",
            price: "$2345.2",
            priceNumber: 2345.2,
            status: "Available",
            priceChange: "2.33",
            noOfAlerts: 2,
        };

        const items_stocks: UserStockAlert[] = [
            {
                title: "Price Change of $10",
                target: "10",
                notes: "Sell sell this when this happens",
                info: "Created 2 days ago",
                help: "The alert will be ativated when the price moves more thatn $10 within a single trading day.",
            },
            { title: "SPCE", notes: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", info: "Last triggered 3 days ago" },
            { title: "TSLA", notes: "Tesla", info: "Created 2 days ago" },
            { title: "MSFT", notes: "Microsoft Corp", info: "$3332.13" },
            { title: "SONO", notes: "Sonos", info: "Created 2 days ago" },
            { title: "SPCE", notes: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", info: "$15.24" },
            { title: "TSLA", notes: "Tesla", info: "Created 2 days ago" },
            { title: "MSFT", notes: "Microsoft Corp", info: "Created 2 days ago", notification_types: ["email", "push"] },
        ];
        this.items_stocks = items_stocks;
        this.stock = stock;
    }

    private createItem() {
        const item = document.createElement("vaadin-context-menu-item");
        const icon = document.createElement("vaadin-icon");
        item.setAttribute("aria-label", "Other save options");
        icon.setAttribute("icon", `vaadin:ellipsis-dots-v`);
        item.appendChild(icon);
        return item;
    }

    private handleMinimalMode(e: Event) {
        this.minimalMode = e.detail.value == 0;
    }

    private handleRowClick(e: Event, item: UserStockAlert) {
        this.dialogOpened = true;
        this.dialogItem = item;
    }

    private alertTypeRenderer = (root: HTMLElement) => {
        render(
            html`
                <vaadin-list-box>
                    <span
                        style="font-size: var(--lumo-font-size-tiny);
                animation: 1s 0.03s elasticExpand cubic-bezier(0.215, 0.61, 0.355, 1) both;"
                        >OPTIONS</span
                    >
                    <hr />
                    <vaadin-item value="one-off">
                        <div style="display: flex; align-items: center;">
                            <fa-icon class="fas fa-dice-one"></fa-icon>
                            <span style="color: var(--lumo-primary-text-color); padding: 10px;">One off</span>
                        </div>
                    </vaadin-item>
                    <vaadin-item value="repeated">
                        <div style="display: flex; align-items: center;">
                            <fa-icon class="fas fa-redo-alt"></fa-icon>
                            <span style="color: var(--lumo-primary-text-color); padding: 10px;">Repeated</span style="color: var(--lumo-primary-text-color); padding: 10px;">
                        </div>
                    </vaadin-item>
                </vaadin-list-box>
            `,
            root
        );
    };

    private editModalRenderer(item: UserStockAlert) {
        return html`
            <section>
                <vaadin-select label="Choose Alert Type" .renderer="${this.alertTypeRenderer}"></vaadin-select>
                <vaadin-text-area
                    style="width: 100%;"
                    id="editTextArea"
                    label="Notes"
                    .maxlength="600"
                    .value="${item.notes}"
                    @value-changed="${(e: CustomEvent) => (item.notes = e.detail.value)}"
                    .helperText="${`${item.notes.length}/600`}"
                >
                </vaadin-text-area>
                <vaadin-text-field style="border-color: white; background-color: white;" label="Target" required error-message="This field is required">${item.value}</vaadin-text-field>
            </section>
        `;
    }

    private handleMenuAction(e: Event, item: UserStockAlert) {
        console.log("handleMenuAction", e.detail.value);
        const value = e.detail.value;

        if (value.text == "Delete") {
            this.items_stocks = this.items_stocks.filter((e) => e !== item);
        } else if (value.text == "Edit") {
            // Give time for the menu modal to be removed before bringing up the page modal
            setTimeout(() => {
                var event = new CustomEvent("editopen-changed", { detail: { modalOpen: true, modalTitle: "Edit Alert", modalRenderer: this.editModalRenderer(item) } });
                this.dispatchEvent(event);
            }, 500);
        }
    }

    private renderMenu(item: UserStockAlert) {
        var items = [
            {
                component: this.createItem(),
                children: [{ text: "OPTIONS" }, { component: "hr" }, { text: "Suggest new feature" }, { component: "hr" }, { text: "Edit" }, { text: "Delete" }],
            },
        ];
        return html` <vaadin-menu-bar style="z-index: -1;" theme="icon" .items="${items}" @item-selected=${(e) => this.handleMenuAction(e, item)}></vaadin-menu-bar>`;
    }

    private handleAddAlert() {
        this.modalOpen = true;
    }

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <table>
                    <thead>
                        <tr>
                            <th style="vertical-align: bottom;">
                                <span class="headerTitle">Alerts</span>
                            </th>

                            <vaadin-horizontal-layout id="viewmodes" style="align-items: right;" theme="spacing">
                                <vaadin-list-box @selected-changed=${this.handleMinimalMode} style="position: sticky; font-size: var(--lumo-font-size-micro); margin: 0px;  float:right;" selected="0">
                                    <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);">minimal mode</vaadin-item>
                                    <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);">show more</vaadin-item>
                                </vaadin-list-box>
                            </vaadin-horizontal-layout>
                            <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                <vaadin-button id="addToWatch" @click=${this.handleAddAlert}>Add</vaadin-button>
                            </vaadin-vertical-layout>
                        </tr>
                    </thead>

                    ${this.items_stocks?.map((item, index) => {
                        return html`
                            <tr role="row" index="${index}" @click=${(e) => this.handleRowClick(e, item)}>
                                <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                                <td style="width: 65%;">
                                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                        <!-- <vaadin-avatar img="${item?.logoUrl}" name="${item.title}" theme="xsmall"></vaadin-avatar> -->
                                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                            <span class="stockSymbol">${item.title} </span>
                                            <!-- <span class="companyName">${item.notes}</span> -->
                                            ${this.minimalMode ? html`` : html`<span style="font-size: 0.6em;">${item.notes}</span>`}
                                            <span style="font-size: 0.6em;">
                                                ${item.info}
                                                ${
                                                    this.minimalMode
                                                        ? html``
                                                        : html` ${item.notification_types?.map((nt, index) => {
                                                              var output = " ";
                                                              if (index == 0) {
                                                                  output += "| ";
                                                              }

                                                              output += nt;

                                                              return output;
                                                          })}`
                                                }</span
                                            >
                                        </vaadin-vertical-layout>
                                    </vaadin-horizontal-layout>
                                </td>
                                <td style="width: 10%;">
                                    <paper-toggle-button class="yld0-toggle" ?checked=${!alert.enabled}>
                           
                                        <!-- <vaadin-menu-bar theme="icon" .items="${this.items_menu}"></vaadin-menu-bar> -->
                                    </paper-toggle-button>
                                </td>
                                <td style="width: 10%;">
                                      ${this.renderMenu(item)}
                                    </paper-toggle-button>
                                </td>
                            </tr>
                        `;
                    })}
                </table>
            </section>
            <br />

            <!-- dialog -->
            <vaadin-dialog
                aria-label="Help Info"
                .opened="${this.dialogOpened}"
                @opened-changed="${(e: CustomEvent) => (this.dialogOpened = e.detail.value)}"
                .renderer="${guard([], () => (root: HTMLElement) => {
                    render(
                        html`
                            <vaadin-vertical-layout theme="spacing" style="width: 300px; max-width: 100%; align-items: stretch;">
                                <h2 style="margin: var(--lumo-space-m) 0; font-size: 1.5em; font-weight: bold;">${this.dialogItem?.title}</h2>
                                <p style="font-size: var(--lumo-font-size-xxs);" label="Description">${this.dialogItem?.help}</p>
                                <vaadin-button @click="${() => (this.dialogOpened = false)}" style="align-self: flex-end;"> Close </vaadin-button>
                            </vaadin-vertical-layout>
                        `,
                        root
                    );
                })}"
            ></vaadin-dialog>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- add alert modal -->
            <addalert-modal .stock=${this.stock} title="Add alert" ?open="${this.modalOpen}" @closed="${(e: CustomEvent) => (this.modalOpen = e.detail.value)}"></addalert-modal>
        `;
    }
}

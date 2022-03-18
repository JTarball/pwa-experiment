import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/grid";
import "@vaadin/vaadin-radio-button";
import "@vaadin/button";
import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/text-field";
import "@vaadin/vertical-layout";
import "@vaadin/text-area";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/menu-bar";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { GetAlertFollows } from "./GetAlertFollows.query.graphql.js";
import { DeleteFollow } from "../home-watchlist/DeleteFollow.query.graphql.js";
import { renderLoading } from "../../../helpers/utilities/graphql_helpers.js";

//import { client } from "../store/client";

import "../../molecules/yld0-simple-message-box/message-box";
import { formatError, dialogGraphError } from "../../../helpers/dialog-graphql-error";

import "./add-alert/add-alert-modal";
import "../../atoms/select/select";

///import { myState } from "../../store/state";
//import { truncate } from "../../helpers/utilities/helpers";
//import "./add-fair-price-modal";

import "../../atoms/toggle-button/toggle-button";
import "../../atoms/toggle-group/toggle-group";
import "../../atoms/help/help";
import "../../atoms/help-tooltip/help-tooltip";
import { goPath } from "../../../router/index.js";

@customElement("home-alerts")
class HomeAlerts extends LitElement {
    // A web component for tabularise a user's watchlist

    // -- State for some display options -- //

    @state()
    showLoading: Boolean = false;

    @state()
    private priceSelected?: String = "2";

    @state()
    private minimalMode: Boolean = false;

    @state()
    private modalOpen: Boolean = false;

    // -- End of state display options -- //

    @state()
    private items?;

    @state()
    private modalItem: Object;

    query = new ApolloQueryController(this, GetAlertFollows, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
    });

    deleteFollow = new ApolloMutationController(this, DeleteFollow);

    // --- Styles --- //
    static styles = [
        themeStyles, // Table styling and a few extras
        css`
            vaadin-button {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
                height: var(--lumo-button-size);
            }

            /* #addToWatch {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
            } */

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
        `,
    ];
    // --- End of Styles --- //

    // -- Start of lifecycle methods -- //

    // We want to enable polling in case of updates
    connectedCallback() {
        super.connectedCallback();
        this.query.startPolling(30000);
        console.log("connected");
    }

    // We want to disable polling when exiting
    disconnectedCallback() {
        super.disconnectedCallback();
        this.query.stopPolling();
        console.log("disconnected");
    }

    // --- End of lifecycles --- //

    private handleAddFollow() {
        // handleAddFollow - create a new follow for a stock, by calling the feapi
        console.debug("handleAddFollow");

        // Stop polling else the modal could be affected.
        this.query.stopPolling();

        // Open modal
        this.modalOpen = true;

        // function searchRenderer() {
        //     return html` <search-list></search-list> `;
        // }

        // var event = new CustomEvent("addfollow-clicked", {
        //     detail: {
        //         modalOpen: true,
        //         modalTitle: "",
        //         modalRenderer: searchRenderer(),
        //     },
        // });
        // this.dispatchEvent(event);
    }

    private handleGoStock() {}

    // -- Render Helpers -- //
    private createItem() {
        const item = document.createElement("vaadin-context-menu-item");
        const icon = document.createElement("vaadin-icon");
        item.setAttribute("aria-label", "Other save options");
        icon.setAttribute("icon", `vaadin:ellipsis-dots-v`);
        item.appendChild(icon);
        return item;
    }

    private handleMinimalMode(e: Event) {
        // Change the selected
        console.debug("handlePriceView,", e.detail);
        this.minimalMode = e.detail.value == 0;
    }

    private handlePriceView(e: Event) {
        // Change the selected
        console.debug("handlePriceView,", e.detail);
        this.priceSelected = e.detail.value;
    }

    // -- Other Renders -- //

    private renderRow(item, index) {
        return html`
            <tr
                role="row"
                index="${index}"
                @click=${() => {
                    goPath("/alerts/" + item.symbol, "?backurl=/alerts");
                }}
            >
                <td style="width: 90%;">
                    <vaadin-horizontal-layout style="align-this.items: center;" theme="spacing">
                        <vaadin-avatar img="${item?.logo_url}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span class="stockSymbol">${item.symbol} </span>
                            <span class="companyName">${item.company_name}</span>
                            <span style="font-size: 0.6em;">
                                ${item.alerts.length} ${item.alerts.length > 1 ? "alerts" : "alert"}
                                <!-- ${this.minimalMode
                                    ? html``
                                    : html` ${item.notification_types?.map((nt, index) => {
                                          var output = " ";
                                          if (index == 0) {
                                              output += "| ";
                                          }

                                          output += nt;

                                          return output;
                                      })}`}</span -->
                            </span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width: 10%;">
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <vaadin-button id="addToWatch">Add alert to ${item.symbol}</vaadin-button>
                    </vaadin-vertical-layout>
                </td>
            </tr>
        `;
    }

    private renderLastRow() {
        return html`
            <tr style="border: none;">
                <td style="width: 55%;border: none;"></td>
                <td style="width:40%; border: none; text-align: right;">
                    <vaadin-button theme="small" id="addToWatch" style="margin-left: 10px;" @click=${this.handleAddFollow}>Add</vaadin-button>
                </td>
                <td style="width: 5%; border: none;"></td>
            </tr>
        `;
    }

    private renderFairValuation(item: Object) {
        return html` <add-fair-price-modal .stock=${item}></add-fair-price-modal> `;
    }

    // -- Main Render -- //
    render() {
        const { data, options, loading, error, errors, networkStatus } = this.query;
        const items = data?.follows.items;
        this.items = items;
        console.debug(data, loading, error, errors, networkStatus, items);

        const group = [
            { id: 1, label: "Lemon" },
            { id: 2, label: "Repeated" },
        ];

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
            console.log("danvir, clear");
            clearTimeout(t);
        }

        if (this.showLoading && loading) {
            console.log("danvir, renderLoading");
            return renderLoading();
        }

        console.log("danvir, after");

        // if (loading) {
        //     //const loader = document.querySelector('.loader');
        //     var t = setTimeout("showSpinner()", 50);
        //     return renderLoading();
        // }

        //clearTimeout(t);

        return html`
            <!-- slot, just in case although not sure it make sense with this specific component -->
            <slot></slot>

            ${this.items?.length == 0
                ? html`
                      <!-- <generic-help>Repeating Alert: Sends one alert and then resets the alert</generic-help> -->
                      <!-- <toggle-group .items=${group}></toggle-group> -->
                      <!-- <toggle-button>One-Off Alert</toggle-button>
                      <toggle-button>Repeated Alert</toggle-button> -->
                      <!-- <select-input></select-input> -->

                      <help-tooltip>
                          <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                          <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p>
                      </help-tooltip>
                      <br />

                      <toggle-group label="Notification" .items=${group} selectMany></toggle-group>
                      <message-box loaded boxImg="/images/no_items_alerts.svg" boxTitle="No alerts configured" boxSubtitle="Add an alert to be notified on various indicators" help="">
                          <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                              <vaadin-button @click="${this.handleAddFollow}" theme="primary">Add an Alert</vaadin-button>
                          </vaadin-horizontal-layout>
                      </message-box>
                  `
                : html`
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
                                          <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);">prices</vaadin-item>
                                      </vaadin-list-box>
                                  </vaadin-horizontal-layout>
                              </tr>
                          </thead>
                          ${this.items?.map((item, index) => {
                              return html`${this.renderRow(item, index)}`;
                          })}
                          ${this.renderLastRow()}
                      </table>
                  `}
            <!-- slot, just in case -->
            <slot></slot>

            <!-- add alert modal -->
            <addalert-modal
                .stock=${this.items[0]}
                title="Add an Alert"
                ?open="${this.modalOpen}"
                @closed="${(e: CustomEvent) => {
                    this.modalOpen = e.detail.value;
                    this.query.refetch();
                }}"
            ></addalert-modal>
        `;
    }
}

// https://erpnext.com/
//                       <!-- slide up modal -->
// <!-- <modal-slide-up .item=${this.modalItem} ?open=${this.modalOpen} @closed="${(e: CustomEvent) => (this.modalOpen = e.detail.value)}"></modal-slide-up> -->
// <page-modal .title="${this.modalTitle}" open></page-modal>

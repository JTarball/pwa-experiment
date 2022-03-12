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

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { GetFollows } from "./GetFollows.query.graphql";
import { DeleteFollow } from "./DeleteFollow.query.graphql.js";

//import { client } from "../store/client";

import "../../components/yld0-simple-message-box/message-box";
import { formatError, dialogGraphError } from "../../helpers/dialog-graphql-error";
import { myState } from "../../store/state";
import { truncate } from "../../helpers/utilities/helpers";
import "./add-fair-price-modal";

@customElement("home-watchlist")
class HomeWatchList extends LitElement {
    // A web component for tabularise a user's watchlist

    // -- State for some display options -- //

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

    query = new ApolloQueryController(this, GetFollows, {
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

        function searchRenderer() {
            return html` <search-list></search-list> `;
        }

        var event = new CustomEvent("addfollow-clicked", {
            detail: {
                modalOpen: true,
                modalTitle: "",
                modalRenderer: searchRenderer(),
            },
        });
        this.dispatchEvent(event);
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

    private showPriceChange(item) {
        // show price change dependent on selected vaadin-list-box

        switch (this.priceSelected) {
            case 0:
                return html`
                    ${item.price_change ? html`<span class="${item.price_change > 0 ? "success" : "error"}">${item.price_change > 0 ? "+" : ""}${item.price_change.toFixed(3)}</span>` : html`?`} |
                    ${item.price_change_percent
                        ? html`<span class="priceChange" theme="badge small ${item.price_change_percent > 0 ? "success" : "error"}"
                              >${item.price_change_percent > 0 ? "+" : ""}${item.price_change_percent}%</span
                          >`
                        : html`?`}
                `;
            case 1:
                return html`
                    ${item.price_change_1yr ? html`<span class="${item.price_change_1yr > 0 ? "success" : "error"}">${item.price_change_1yr > 0 ? "+" : ""}${item.price_change_1yr}</span>` : html`?`} |
                    ${item.price_change_1yr_percent
                        ? html`<span class="priceChange" theme="badge small ${item.price_change_1yr_percent > 0 ? "success" : "error"}"
                              >${item.price_change_1yr_percent > 0 ? "+" : ""}${item.price_change_1yr_percent}%</span
                          >`
                        : html`?`}
                `;
            case 2:
                return html`
                    ${item.price_change_since_watched
                        ? html`<span class="${item.price_change_since_watched > 0 ? "success" : "error"}"
                              >${item.price_change_since_watched > 0 ? "+" : ""}${item.price_change_since_watched.toFixed(3)}</span
                          >`
                        : html``}
                    ${item.price_change_since_watched ? html`|` : html``}
                    ${item.price_change_since_watched_percent
                        ? html`<span theme="badge small ${item.price_change_since_watched_percent > 0 ? "success" : "error"}"
                              >${item.price_change_since_watched_percent > 0 ? "+" : ""}${item.price_change_since_watched_percent}%</span
                          >`
                        : html``}
                `;
            default:
                return html`
                    ${item.price_change_since_watched
                        ? html`<span class="${item.price_change_since_watched > 0 ? "success" : "error"}"
                              >${item.price_change_since_watched > 0 ? "+" : ""}${item.price_change_since_watched.toFixed(3)}</span
                          >`
                        : html``}
                    ${item.price_change_since_watched ? html`|` : html``}
                    ${item.price_change_since_watched_percent
                        ? html`<span theme="badge small ${item.price_change_since_watched_percent > 0 ? "success" : "error"}"
                              >${item.price_change_since_watched_percent > 0 ? "+" : ""}${item.price_change_since_watched_percent}%</span
                          >`
                        : html``}
                `;
        }
    }

    private async handleMenuAction(e: Event, item) {
        console.log("handleMenuAction", e.detail.value);
        const value = e.detail.value;

        if (value.text == "Set 'fair' price target") {
            var event = new CustomEvent("addvaluation-clicked", { detail: { modalOpen: true, modalTitle: `Set a valuation price for ${item.symbol}`, modalRenderer: this.renderFairValuation(item) } });
            this.dispatchEvent(event);
        } else if (value.text == "Unfollow") {
            const { data, error, loading } = await this.deleteFollow.mutate({
                variables: {
                    symbol: item.symbol,
                },
            });

            if (!error && !loading) {
                this.query.refetch();
            }
        }
    }

    // -- Other Renders -- //
    private renderMenu(item) {
        var items = [
            {
                component: this.createItem(),
                children: [{ component: "hr" }, { text: "Set 'fair' price target" }, { component: "hr" }, { text: "Unfollow" }],
            },
        ];
        return html` <vaadin-menu-bar style="z-index: -1;" theme="icon" .items="${items}" @item-selected=${(e) => this.handleMenuAction(e, item)}></vaadin-menu-bar>`;
    }

    private renderRow(item, index) {
        return html`
            <tr role="row" index="${index}" @click=${this.goStock}>
                <td style="width: 60%;">
                    <vaadin-horizontal-layout style="align-this.items: center;" theme="spacing">
                        <vaadin-avatar img="${item?.logo_url}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span class="stockSymbol">${item.symbol} </span>
                            <span class="companyName">${item.company_name}</span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width:39%; text-align: right;">
                    <vaadin-horizontal-layout style="float:right;" theme="spacing">
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            ${this.minimalMode
                                ? html``
                                : html`
                                      <span class="price" style="padding-left: 10px; font-size: 1.0em; font-weight: 500; color: var(--primary-text-color);">${item.price}</span>
                                      <span class="priceChange">${this.showPriceChange(item)}</span>
                                  `}
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
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

        if (error) {
            return dialogGraphError(formatError(options, error));
        }

        if (loading) {
            // https://nzbin.github.io/three-dots/
            setTimeout(function () {
                return html`
                    <div class="dot-stage">
                        <div class="dot dot-0"></div>
                        <div class="dot dot-1"></div>
                        <div class="dot dot-2"></div>
                    </div>
                `;
            }, 1000); // we dont want to display loading if under a second, looks naff
        }

        return html`
            <!-- slot, just in case although not sure it make sense with this specific component -->
            <slot></slot>

            ${this.items?.length == 0
                ? html`
                      <message-box
                          loaded
                          boxImg="/images/no_items_watching.svg"
                          boxTitle="No stocks in the watchlist"
                          boxSubtitle="Add a stock to your watchlist to add alerts, notes & more ..."
                          help=""
                      >
                          <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                              <vaadin-button @click="${this.handleAddFollow}" theme="primary">Add Follow</vaadin-button>
                          </vaadin-horizontal-layout>
                      </message-box>
                  `
                : html`
                      <!-- Main table data -->
                      <table class="yld0">
                          <thead>
                              <tr style="border-color: var(--lumo-contrast-10pct);border-bottom-style: solid;border-bottom-width: 1px;">
                                  <th style="vertical-align: bottom;">
                                      <span class="headerTitle">Following</span>
                                  </th>
                                  <th></th>

                                  <vaadin-horizontal-layout id="viewmodes" style="align-items: right;" theme="spacing">
                                      ${this.minimalMode
                                          ? html``
                                          : html`
                                                <vaadin-list-box
                                                    @selected-changed=${this.handlePriceView}
                                                    style="font-size: var(--lumo-font-size-micro); margin: 0px;  float:right;"
                                                    selected="${this.priceSelected}"
                                                >
                                                    <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);"
                                                        >1d change</vaadin-item
                                                    >
                                                    <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);"
                                                        >1yr change</vaadin-item
                                                    >
                                                    <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px;  padding: 3px;min-height:  var(--lumo-font-size-micro);"
                                                        >Since watched</vaadin-item
                                                    >
                                                    <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px;  padding: 3px;min-height:  var(--lumo-font-size-micro);"
                                                        >User 'fair' price</vaadin-item
                                                    >
                                                </vaadin-list-box>
                                            `}

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
        `;
    }
}

// https://erpnext.com/
//                       <!-- slide up modal -->
// <!-- <modal-slide-up .item=${this.modalItem} ?open=${this.modalOpen} @closed="${(e: CustomEvent) => (this.modalOpen = e.detail.value)}"></modal-slide-up> -->
// <page-modal .title="${this.modalTitle}" open></page-modal>

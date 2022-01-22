/* Full Page Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, state } from "lit/decorators.js";

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
import { Notification } from "@vaadin/notification";
import { NotificationRenderer, NotificationOpenedChangedEvent } from "@vaadin/notification";

import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { GetStocks } from "./Stocks.query.graphql";
import { AddFollow } from "./AddFollow.mutation.graphql.js";
//import { getClient } from "../../store/client";

@customElement("search-list")
class SearchList extends LitElement {
    /* Properties, states, mixins etc. */
    @state()
    private searchVal: String = "";

    @state()
    private notificationOpened = false;

    @state()
    notificationSymbol = "";

    query = new ApolloQueryController(this, GetStocks, {
        variables: {
            name: this.searchVal,
        },
    });

    addFollow = new ApolloMutationController(this, AddFollow);

    @state()
    private items_recent?: UserStock[];

    @state()
    private results?: UserStock[];

    /* End of properties, states ... */

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
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

            table th span.headerTitle {
                color: var(--secondary-text-color);
            }
        `,
    ];

    firstUpdated() {
        // const items;
        const items_recent: UserStock[] = [
            {
                symbol: "MSFT",
                company_name: "Microsoft Corp",
                logo_url: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "2.434",
                priceChangeSinceWatched: "6.00",
                priceChangeSinceWatchedPercent: "1.466",
            },
            {
                symbol: "MSFT",
                company_name: "Microsoft Corp",
                logo_url: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "3.566",
                priceChangeSinceWatched: "6.34",
                priceChangeSinceWatchedPercent: "2.416",
            },
            {
                symbol: "AMD",
                company_name: "Advanced Micro Devices, Inc.",
                logo_url: "https://logo.clearbit.com/amd.com",
                price: "$137.75",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "2.466",
                priceChangeSinceWatched: "8.12",
                priceChangeSinceWatchedPercent: "2.366",
            },
        ];

        this.items_recent = items_recent;

        if (this.searchVal == "") {
            this.results = this.items_recent;
        }
    }

    updated(changedProperties: PropertyValues<this>) {
        super.updated(changedProperties);
        console.log(this.query);
        console.log(window.localStorage);
    }

    async handleAddFollow(symbol: string) {
        console.log(symbol);
        const { data, error, loading } = await this.addFollow.mutate({
            variables: {
                symbol: symbol,
            },
        });

        if (!error && !loading) {
            // var event = new CustomEvent("data-changed", {
            //     detail: {},
            // });
            // this.dispatchEvent(event);

            // Close modal
            // this.parentElement?.removeAttribute("open");

            this.parentElement?._wrapper.classList.add("closing");

            // Lazy way to wait for css slide out transition
            setTimeout(() => {
                const closed = new CustomEvent("closed", {
                    detail: {
                        value: false,
                    },
                });
                this.parentElement?.dispatchEvent(closed);
                this.parentElement?._wrapper.classList.remove("closing");
                this.notificationOpened = true;
                this.notificationSymbol = symbol;

                //Notification.show(`Added ${symbol} to your watchlist.`);
            }, 500);
        }

        console.log(data, error, loading);
    }

    renderer: NotificationRenderer = (root) => {
        render(
            html`
                <vaadin-horizontal-layout style="align-items: center;">
                    <div>Added ${this.notificationSymbol} to your watchlist.</div>
                    <!-- <vaadin-button style="margin-left: var(--lumo-space-xl);" theme="primary" @click="${() => (this.notificationOpened = false)}"> Undo ${this.isMac
                        ? "⌘"
                        : "Ctrl-"}Z </vaadin-button> -->
                    <!-- Ideally, this should be hidden if the
                     device does not have a physical keyboard -->
                </vaadin-horizontal-layout>
            `,
            root
        );
    };

    render() {
        return html`
            <vaadin-notification
                theme="contrast"
                duration="2000"
                .opened="${this.notificationOpened}"
                @opened-changed="${(e: NotificationOpenedChangedEvent) => {
                    this.notificationOpened = e.detail.value;
                }}"
                .renderer="${this.renderer}"
            ></vaadin-notification>





            <vaadin-text-field
                id="searchfield"
                style="
                position: absolute;
                top: 5px;
                margin-left: auto;
                margin-right: auto;
                left: 0;
                right: 0;
                text-align: center;
                /* padding-left: 10%;
                padding-right: 200px; */
                width: 60%;
                "
                placeholder="${this.query.data?.stocks?.total_results} available stocks"
                @keyup=${(e) => {
                    console.log(e.srcElement.value);
                    this.searchVal = e.srcElement.value;
                    this.results = this.items_stock;
                    this.query.variables = { name: this.searchVal };
                }}
                .value=${this.searchVal}
                clear-button-visible
            >
                <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
            </vaadin-text-field>

            ${this.searchVal}

            <div id="content">
    
                          <table style="overflow: scroll;">
                              <thead>
                                  <tr role="header">
                                      <th style="vertical-align: bottom;">
                                          <span class="headerTitle">${this.searchVal ? "Results" : "Recent"}</span>
                                      </th>
                                      <th><span>${this.query.data?.stocks?.items.length}</span></th>
                                  </tr>
                              </thead>
                              ${
                                  this.query?.error
                                      ? html`${this.query.error.message}`
                                      : html`

                                            ${
                                                this.searchVal
                                                    ? html` ${this.query.data?.stocks?.items.map((item, index) => {
                                                          return html`
                                                              <tr role="row" index="${index}" @click=${(e) => this.handleRowClick(e, item)}>
                                                                  <td style="width: 65%;">
                                                                      <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                                                          <vaadin-avatar img="${item?.logo_url}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                                                                          <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                                              <span class="stockSymbol">${item.symbol} </span>
                                                                              <span class="companyName">${item.company_name}</span>
                                                                          </vaadin-vertical-layout>
                                                                      </vaadin-horizontal-layout>
                                                                  </td>

                                                                  <td style="width: 10%;">
                                                                      <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                                          <vaadin-button
                                                                              id="addToWatch"
                                                                              @click="${() => {
                                                                                  this.handleAddFollow(item.symbol);
                                                                              }}"
                                                                              >Add to alerts</vaadin-button
                                                                          >
                                                                      </vaadin-vertical-layout>
                                                                  </td>
                                                              </tr>
                                                          `;
                                                      })}`
                                                    : html`
                                                          ${this.items_recent?.map((item, index) => {
                                                              return html`
                                                                  <tr role="row" index="${index}">
                                                                      <td style="width: 65%;">
                                                                          <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                                                              <vaadin-avatar img="${item?.logo_url}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                                                                              <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                                                  <span class="stockSymbol">${item.symbol} </span>
                                                                                  <span class="companyName">${item.company_name}</span>
                                                                              </vaadin-vertical-layout>
                                                                          </vaadin-horizontal-layout>
                                                                      </td>

                                                                      <td style="width: 10%;">
                                                                          <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                                              <vaadin-button
                                                                                  id="addToWatch"
                                                                                  @click="${() => {
                                                                                      this.handleAddFollow(item.symbol);
                                                                                  }}"
                                                                                  >Watch</vaadin-button
                                                                              >
                                                                          </vaadin-vertical-layout>
                                                                      </td>
                                                                  </tr>
                                                              `;
                                                          })}
                                                      `
                                            }
                          </table>
                      `
                              }
            </div>
            <slot></slot>
        `;
    }
}

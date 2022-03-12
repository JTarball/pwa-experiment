import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { throttle } from "throttle-debounce";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/button";
import "@vaadin/text-field";

import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { formatError, dialogGraphError } from "../../../helpers/dialog-graphql-error";
import { renderLoading } from "../../../helpers/utilities/graphql_helpers.js";
import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { showHowManyAlertsConfigured } from "../helpers";
import { GetStocks } from "./GetStocks.query.graphql";
import { GetFollows } from "./GetFollows.query.graphql.js";

@customElement("select-stock")
class SelectStock extends LitElement {
    // --- Properties, states, mixins etc.  --- //
    @state()
    isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

    @state()
    private searchVal: String = "";

    @state()
    private items_following?: Object[];

    @state()
    private results?: Object[];

    query = new ApolloQueryController(this, GetStocks, {
        variables: {
            name: this.searchVal,
        },
    });

    follows = new ApolloQueryController(this, GetFollows, {
        fetchPolicy: "network-only", // Used for first execution
        nextFetchPolicy: "cache-first", // Used for subsequent executions
        showErrorStack: "json",
    });

    private refetchThrottle = throttle(1000, false, () => {
        console.debug("THROTTLE refetch", this.searchVal);
        this.query.variables = { name: this.searchVal };
        this.query.refetch();
    });

    // --- End of properties, states ... --- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            #content {
                margin-top: 50px;
                overflow: scroll;
            }

            .addAlert {
                cursor: pointer;
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
            }

            table th span.headerTitle {
                color: var(--secondary-text-color);
            }

            table th span.headerDescription {
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-xxs);
                color: var(--lumo-secondary-text-color);
                font-weight: normal;
                padding: 1em;
            }
        `,
    ];

    async handleAddAlert(item: Object) {
        const add = new CustomEvent("addalert", {
            detail: {
                symbol: item.symbol,
                stock: item,
            },
        });
        this.dispatchEvent(add);
    }

    async updateSearch(e: Event) {
        this.searchVal = e.srcElement.value;
        this.refetchThrottle();
    }

    render() {
        const { data, options, loading, error, errors, networkStatus } = this.follows;
        this.items_following = data?.follows?.items;
        console.debug("GetFollows ", data, loading, error, errors, networkStatus, this.items_following);

        this.results = this.query.data?.stocks?.items;

        if (error || this.query.error) {
            return dialogGraphError(formatError(options, error));
        }

        if (loading || this.query.loading) {
            return renderLoading();
        }

        return html`
            <vaadin-text-field
                id="searchfield"
                style="
                position: absolute;
                top: 75px;
                margin-left: auto;
                margin-right: auto;
                left: 0;
                right: 0;
                text-align: center;
                /* padding-left: 10%;
                padding-right: 200px; */
                width: 50%;
                "
                placeholder=""
                @keyup=${this.updateSearch}
                @change=${this.updateSearch}
                .value=${this.searchVal}
                clear-button-visible
            >
                <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
            </vaadin-text-field>

            <div id="content">
                <table class="yld0" style="overflow: scroll;">
                    <thead>
                        <tr role="header">
                            <th style="vertical-align: bottom;">
                            <vaadin-vertical-layout>
                                <span class="headerTitle">${this.searchVal ? "Results" : "Currently Following"}</span>
                                <span class="headerDescription">Add an alert to one of your watchlist, or you use the search for adding an alert against something new</span>
                            </vaadin-vertical-layout>
                            </th>
                            ${this.isMobile ? html`` : html` <th></th> `}
                            <th><span>${this.searchVal ? this.results?.length : this.items_following.length}</span></th>
                        </tr>
                    </thead>
                    ${
                        this.query?.error
                            ? html`${this.query.error.message}`
                            : html`
                                ${
                                    this.searchVal
                                        ? html` ${this.results?.map((item, index) => {
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
                                                                  class="addAlert"
                                                                  @click="${() => {
                                                                      this.handleAddAlert(item);
                                                                  }}"
                                                                  >Add an Alert</vaadin-button
                                                              >
                                                          </vaadin-vertical-layout>
                                                      </td>
                                                  </tr>
                                              `;
                                          })}`
                                        : html`
                                              ${this.items_following?.map((item, index) => {
                                                  return html`
                                                      <tr role="row" index="${index}">
                                                          <td style="width: 68%;">
                                                              <vaadin-horizontal-layout style="align-this.items: center;" theme="spacing">
                                                                  <vaadin-avatar img="${item?.logo_url}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                                                                  <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                                      <span class="stockSymbol">${item.symbol} </span>
                                                                      <span class="companyName">${item.company_name}</span>
                                                                  </vaadin-vertical-layout>
                                                              </vaadin-horizontal-layout>
                                                          </td>
                                                          ${this.isMobile
                                                              ? html``
                                                              : html`
                                                                    <td style="width: 22%;">
                                                                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                                            <span style="font-size: 1em; color: var(--lumo-contrast);">${showHowManyAlertsConfigured(item.alerts)}</span>
                                                                        </vaadin-vertical-layout>
                                                                    </td>
                                                                `}
                                                          <td style="width: 10%;">
                                                              <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                                  <vaadin-button
                                                                      class="addAlert"
                                                                      @click="${() => {
                                                                          this.handleAddAlert(item);
                                                                      }}"
                                                                      >Add an Alert</vaadin-button
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

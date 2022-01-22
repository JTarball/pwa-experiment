import { LitElement, html, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";
import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";

import "@vaadin/avatar";
import "@vaadin/button";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { NotificationOpenedChangedEvent } from "@vaadin/notification";

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { AddFollow } from "./AddFollow.mutation.graphql.js";
import { GetRecentStocks } from "./GetRecentStocks.query.graphql.js";
import { GetFollows } from "../home-watchlist/GetFollows.query.graphql.js";
import { UnFollow } from "./UnFollow.mutation.graphql.js";
import { formatError, dialogGraphError } from "../../helpers/dialog-graphql-error";
import { renderLoading } from "../../helpers/utilities/graphql_helpers.js";

import "../../components/yld0-simple-message-box/message-box";
import "../generic/notification";

@customElement("home-recent")
class HomeRecent extends LitElement {
    // -- Properties, states etc. -- //

    @state()
    items?: Object[];

    @state()
    notificationOpened = false;

    @state()
    notificationText: String = "";

    @state()
    symbols_viewed?: String[] = []; // no recent views

    // -- Graphql queries + mutations -- //
    query = new ApolloQueryController(this, GetRecentStocks, {
        variables: {
            symbols: this.symbols_viewed,
        },
        fetchPolicy: "network-only", // Used for first execution
        nextFetchPolicy: "cache-first", // Used for subsequent executions
        noAutoSubscribe: true,
    });
    addFollow = new ApolloMutationController(this, AddFollow);
    unFollow = new ApolloMutationController(this, UnFollow);

    // -- End of properties ... -- //

    static styles = [
        themeStyles, // Table styling and a few extras
        css`
            #watch {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
            }

            #unwatch {
                color: var(--lumo-primary-text-color);
                font-size: var(--lumo-font-size-tiny);
                transform: scale(0.98);
                box-shadow: 3px 2px 8px 1px rgba(0, 0, 0, 0.24);
            }
        `,
    ];

    // -- Lifecycle Functions -- //

    constructor() {
        super();

        // For debug testing
        // window.localStorage.setItem("stocks-recent-viewed", JSON.stringify(["AMD", "TSLA", "SONO", "SONO"]));

        // Get recently viewed symbols from local storage
        this.symbols_viewed = JSON.parse(window.localStorage.getItem("stocks-recent-viewed")) || [];
        this.query.variables = { symbols: this.symbols_viewed };
        this.query.subscribe();
    }

    // -- Handle functions -- //

    // handleFollow add a stock to your watchlist
    private async handleFollow(item: Object) {
        // Useful notes: https://www.apollographql.com/blog/apollo-client/caching/when-to-use-refetch-queries/
        // We mutate the store, so that we dont have to wait for the mutation
        // Understand the difference between update / OptimisticResponse / refetchQueries
        // be careful to include variables else you miss the cache

        const { data, error, loading } = await this.addFollow.mutate({
            variables: {
                symbol: item.symbol,
            },
            update: (store, {}) => {
                // Read the data from the cache for this query.
                const dataQ = store.readQuery({
                    query: GetRecentStocks,
                    variables: {
                        symbols: this.symbols_viewed,
                    },
                });

                // Set following to true
                const following = true;
                let items = this.items?.map((i) => {
                    if (i !== item) {
                        return i;
                    }
                    return { ...item, following };
                });

                const update = { ...dataQ, stocks: { ...dataQ.stocks, items } };

                // Write the data back to the cache.
                store.writeQuery({ query: GetRecentStocks, data: update, variables: { symbols: this.symbols_viewed } });

                // -- Update Watchlist query --

                const dataWatchlist = store.readQuery({
                    query: GetFollows,
                });

                items = [...dataWatchlist.follows.items];
                items.push(item);

                const updateWatchlist = { ...dataWatchlist, follows: { ...dataWatchlist.follows, items } };
                console.log("updateWatchlist", updateWatchlist);

                store.writeQuery({ query: GetFollows, data: updateWatchlist });
            },
        });

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `Added ${item.symbol} to your watchlist.`;
        }
    }

    // handleUnFollow unfollow a symbol
    private async handleUnFollow(item: Object) {
        console.debug("handleUnFollow", item);

        const { data, error, loading } = await this.unFollow.mutate({
            variables: {
                symbol: item.symbol,
            },
            update: (store, {}) => {
                // Read the data from the cache for this query.
                const dataQ = store.readQuery({
                    query: GetRecentStocks,
                    variables: {
                        symbols: this.symbols_viewed,
                    },
                });

                // Set following to false
                const following = false;
                let items = this.items?.map((i) => {
                    if (i !== item) {
                        return i;
                    }
                    return { ...item, following };
                });

                const update = { ...dataQ, stocks: { ...dataQ.stocks, items } };

                // Write the data back to the cache.
                store.writeQuery({ query: GetRecentStocks, data: update, variables: { symbols: this.symbols_viewed } });

                // -- Update Watchlist query --

                // Update watchlist for other tab
                const dataWatchlist = store.readQuery({
                    query: GetFollows,
                });

                items = dataWatchlist.follows.items.filter((f) => f.symbol !== item.symbol);

                const updateWatchlist = { ...dataWatchlist, follows: { ...dataWatchlist.follows, items } };
                console.log("updateWatchlist", updateWatchlist);

                store.writeQuery({ query: GetFollows, data: updateWatchlist });
            },
        });

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `Removed ${item.symbol} to your watchlist.`;
        }
    }

    // -- Other Renders -- //

    private renderRow(item, index) {
        return html`
            <tr role="row" index="${index}" @click=${this.goStock}>
                <td style="width: 90%;">
                    <vaadin-horizontal-layout style="align-this.items: center;" theme="spacing">
                        <vaadin-avatar img="${item?.logo_url}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                            <span class="stockSymbol">${item.symbol} </span>
                            <span class="companyName">${item.company_name}</span>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                </td>
                <td style="width: 10%;">
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        ${item.following
                            ? html` <vaadin-button
                                  id="unwatch"
                                  @click="${() => {
                                      this.handleUnFollow(item);
                                  }}"
                                  >watching</vaadin-button
                              >`
                            : html` <vaadin-button
                                  id="watch"
                                  @click="${() => {
                                      this.handleFollow(item);
                                  }}"
                                  >watch</vaadin-button
                              >`}
                    </vaadin-vertical-layout>
                </td>
            </tr>
        `;
    }

    // -- Main Render -- //
    render() {
        const { data, options, loading, error, errors, networkStatus } = this.query;
        this.items = data?.stocks.items;
        console.debug("GetRecentStocks ", data, loading, error, errors, networkStatus, this.items);

        if (error) {
            return dialogGraphError(formatError(options, error));
        }

        if (loading) {
            return renderLoading();
        }

        return html`
            <section>
                <generic-notification
                    ?opened=${this.notificationOpened}
                    .text="${this.notificationText}"
                    @opened-changed="${(e: NotificationOpenedChangedEvent) => {
                        this.notificationOpened = e.detail.value;
                    }}"
                ></generic-notification>

                <!-- slot, just in case although not sure it make sense with this specific component -->
                <slot></slot>

                ${this.items?.length == 0
                    ? html` <message-box loaded boxImg="" boxTitle="" boxSubtitle="No recently viewed items" help=""> </message-box> `
                    : html`
                          <!-- Main table data -->
                          <table>
                              <thead>
                                  <tr style="border-color: var(--lumo-contrast-10pct);border-bottom-style: solid;border-bottom-width: 1px;"></tr>
                              </thead>
                              ${this.items?.map((item, index) => {
                                  return html`${this.renderRow(item, index)}`;
                              })}
                          </table>
                      `}
            </section>
        `;
    }
}

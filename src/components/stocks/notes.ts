import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";

import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { renderLoading } from "../../helpers/utilities/graphql_helpers.js";
import { formatError, dialogGraphError } from "../../helpers/dialog-graphql-error";
import "../yld0-simple-message-box/message-box";

import { GetStockAlerts } from "./GetStockAlerts.query.graphql.js";

@customElement("stock-notes")
class StockNotes extends LitElement {
    // -- State, properties etc -- //

    @state()
    showLoading: Boolean = false;

    @state()
    private items?;

    query = new ApolloQueryController(this, GetStockAlerts, {
        fetchPolicy: "cache-and-network",
        showErrorStack: "json",
    });

    // -- End of properties etc -- //

    // --- Styles --- //
    static styles = [
        themeStyles, // Table styling and a few extras
        css``,
    ];
    // --- End of Styles --- //

    // -- Start of lifecycle methods -- //

    // We want to enable polling in case of updates
    connectedCallback() {
        super.connectedCallback();
        this.query.startPolling(30000);
    }

    // We want to disable polling when exiting
    disconnectedCallback() {
        super.disconnectedCallback();
        this.query.stopPolling();
    }

    // --- End of lifecycles --- //

    // -- Main Render -- //
    render() {
        const { data, options, loading, error, errors, networkStatus } = this.query;
        this.items = data?.alerts.items;
        console.debug(data, loading, error, errors, networkStatus, this.items);

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

        return html`
            ${this.items?.length == 0
                ? html`
                      <message-box loaded boxImg="/images/no_items_alerts.svg" boxTitle="No alerts configured" boxSubtitle="Add an alert to be notified on various indicators" help="">
                          <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                              <vaadin-button @click="${this.handleAddFollow}" theme="primary">Add an Alert</vaadin-button>
                          </vaadin-horizontal-layout>
                      </message-box>
                  `
                : html``}
            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

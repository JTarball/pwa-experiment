import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { ApolloQueryController } from "@apollo-elements/core";

import { GetDividendHistory } from "../../../graphql/queries/GetDividendHistory.query.graphql";
import { renderLoading } from "../../../helpers/utilities/graphql_helpers.js";
import { formatError, dialogGraphError } from "../../../helpers/dialog-graphql-error";

import "../finbar-table/finbar-table";

@customElement("stock-dividends-history")
export class StockDividendsHistory extends LitElement {
    // -- Start of state, properties, queries -- //

    @state()
    showLoading: Boolean = false;

    @property({ type: String })
    symbol: string;

    query = new ApolloQueryController(this, GetDividendHistory, {
        fetchPolicy: "cache-and-network",
        variables: {
            symbol: "MSFT",
        },
    });

    // -- End of properties, queries etc. -- //

    // -- Main Render -- //
    render() {
        const { data, options, loading, error, errors, networkStatus } = this.query;
        const history = data?.graph_dividend_history;

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
                id: "label",
                label: "Date",
                width_percentage: "30",
            },
            {
                id: "declaration_date",
                label: "Declaration Date",
                width_percentage: "25",
                date_format: true,
            },
            {
                id: "record_date",
                label: "Record Date",
                width_percentage: "25",
                date_format: true,
            },
            {
                id: "payment_date",
                label: "Payment Date",
                width_percentage: "35",
                date_format: true,
            },
            {
                id: "dividend",
                label: "Dividend",
                width_percentage: "10",
            },
        ];

        return html` <finbar-table rowsPerPage="5" width="750" height="450" title="Dividend History" .headerCells=${headerCells} .dataset=${history}> </finbar-table> `;
    }
}

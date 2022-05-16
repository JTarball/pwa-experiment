import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../../templates/y-table";

@customElement("stock-dividends-calendar")
export class StockDividendsCalendar extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Array })
    items = [];

    // -- End of properties, queries etc. -- //

    // -- Main Render -- //
    render() {
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

        return html` <y-table rowsPerPage="5" width="750" height="340" title="Dividend Calendar" .headerCells=${headerCells} .items=${this.items}> </y-table> `;
    }
}

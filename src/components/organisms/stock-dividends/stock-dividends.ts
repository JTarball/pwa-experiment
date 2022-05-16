import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../stock-dividends-calendar/stock-dividends-calendar";
import "../stock-dividends-history/stock-dividends-history";

@customElement("stock-dividends")
export class StockDividends extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Object })
    stock: Object;

    // @query(".wrapper")
    // _wrapper: Element;

    // -- End of properties, queries etc. -- //

    static styles = [badge, utility, spacing, themeStyles, css``];

    // -- Lifecycle function -- //

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        console.log("maxverstappen,", this.stock?.historical_dividends);

        return html`
            <br />
            <br />
            <br />
            <br />

            <stock-dividends-history .items=${this.stock?.historical_dividends}></stock-dividends-history>

            <stock-dividends-calendar .items=${this.stock?.historical_dividends}></stock-dividends-calendar>
        `;
    }
}

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@vaadin/icon";

/**
 * Generic sort icon, tri-state
 *
 * @param  {boolean}    asc    -  A tri-state for setting the sort, if True sort by ascending order,
 *                                if False sort by descending order else if undefined no sorting is applied
 *
 */
@customElement("sort-button")
export class SortButtonElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: false })
    asc?: boolean;

    // -- End of properties, queries etc. -- //

    static styles = [
        css`
            #sort {
                cursor: pointer;
            }
        `,
    ];

    // -- Lifecycle function -- //

    // -- Handle functions -- //

    handleOnClick() {
        if (this.asc == undefined) {
            this.asc = false;
        } else if (this.asc) {
            this.asc = undefined;
        } else {
            this.asc = true;
        }
        var event = new CustomEvent("sort-changed", { detail: { asc: this.asc } });
        this.dispatchEvent(event);
    }

    handleIcon() {
        if (this.asc == undefined) {
            return "vaadin:sort";
        } else if (this.asc) {
            return "vaadin:caret-up";
        } else {
            return "vaadin:caret-down";
        }
    }

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        return html` <vaadin-icon @click="${this.handleOnClick}" id="sort" icon="${this.handleIcon()}"></vaadin-icon> `;
    }
}

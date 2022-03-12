import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/icon";
// import "@vaadin/item";
// import "@vaadin/list-box";
// import "@vaadin/select";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

@customElement("container-pagination")
export class ListPaginationElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Number, reflect: false })
    rows: number = 0;

    @property({ type: Number, reflect: false })
    skip: number = 0;

    @property({ type: Number, reflect: false })
    total: number = 0;

    @state()
    disableLeft: Boolean = false;

    @state()
    disableRight: Boolean = false;

    @state()
    items_select = [
        {
            label: "10",
            value: "recent",
        },
        {
            label: "20",
            value: "rating-desc",
        },
        {
            label: "50",
            value: "rating-asc",
        },
        {
            label: "100",
            value: "price-desc",
        },
    ];

    // -- End of properties, queries etc. -- //

    static styles = [
        // badge,
        // utility,
        // spacing,
        // themeStyles,
        css`
            vaadin-select {
                margin-right: 1rem;
            }
        `,
    ];

    // -- Lifecycle function -- //

    update(changedProperties: PropertyValues) {
        console.log("update,", this.skip, this.rows, this.total);
        this.disableLeft = this.skip - this.rows < 0 ? true : false;
        this.disableRight = this.skip + this.rows >= this.total ? true : false;
        super.update(changedProperties);
    }

    // -- Handle functions -- //
    handlePaginationInfo() {
        console.log("handlePaginationInfo, ", this.skip, this.rows, this.total);
        if (this.total) {
            return html` ${this.skip}-${this.skip + this.rows > this.total ? this.total : this.skip + this.rows} of ${this.total} `;
        } else {
            return html``;
        }
    }

    handleLeftClick() {
        var event = new CustomEvent("previous", { detail: {} });
        this.dispatchEvent(event);
    }

    handleRightClick() {
        var event = new CustomEvent("next", { detail: {} });
        this.dispatchEvent(event);
    }

    // -- Other Renders -- //
    private selectRenderer = (root: HTMLElement) => {
        render(
            html`
                <vaadin-list-box>
                    ${this.items_select.map(
                        (item) => html`
                            <vaadin-item value="${item.value}">
                                <div style="display: flex; align-items: center;">
                                    <div>${item.label}</div>
                                </div>
                            </vaadin-item>
                        `
                    )}
                </vaadin-list-box>
            `,
            root
        );
    };

    // -- Main Render -- //
    render() {
        console.log("render", this.rows, "skip", this.skip, "total", this.total);

        return html`
            <vaadin-horizontal-layout style="align-items: center;">
                <slot></slot>
                <span style="margin-left:auto">${this.handlePaginationInfo()}</span>
                <vaadin-button @click=${this.handleLeftClick} ?disabled=${this.disableLeft} theme="icon" aria-label="Previous Page">
                    <vaadin-icon icon="vaadin:caret-left"></vaadin-icon>
                </vaadin-button>

                <vaadin-button @click=${this.handleRightClick} ?disabled=${this.disableRight} theme="icon" aria-label="Next Page">
                    <vaadin-icon icon="vaadin:caret-right"></vaadin-icon>
                </vaadin-button>
            </vaadin-horizontal-layout>
        `;
    }
}
// <span style="margin-left: auto;">
// <vaadin-select style="width: 5rem;" theme="lemon" label="" .renderer="${this.selectRenderer}"></vaadin-select>
// </span>

// return html`
// <tr>
//     <td>
//         <span>${this.handlePageInfo()}</span>
//         <vaadin-button @click=${this.handleLeftClick} ?disabled=${this.disableLeft} theme="icon" aria-label="Previous Page">
//             <vaadin-icon icon="vaadin:caret-left"></vaadin-icon>
//         </vaadin-button>
//         <vaadin-button @click=${this.handleRightClick} ?disabled=${this.disableRight} theme="icon" aria-label="Next Page">
//             <vaadin-icon icon="vaadin:caret-right"></vaadin-icon>
//         </vaadin-button>
//     </td>
// </tr>
// `;

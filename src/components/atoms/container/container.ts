import { LitElement, html, css } from "lit";
import { customElement, query, property } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/item";
import "@vaadin/list-box";
import "@vaadin/select";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

/**
 * Simple container
 *
 * @param  {Number}    width          -  Width of the container
 * @param  {Number}    height         -  Height of the container
 *
 *
 * Header Cell Examples
 * e.g. Template
 *
 *  <y-container>
 *      <header></header>
 *      <body>Vegan meh food truck pop-up, unicorn bitters plaid seitan stumptown 3 wolf moon</body>
 * </y-container>
 *
 */
@customElement("y-container")
export class YContainer extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: true })
    centre: boolean = false;

    @property({ type: Number })
    width?;

    @property({ type: Number })
    height?;

    @query("div.container")
    container: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .container-wrapper {
                display: table;
                margin: 0.1rem;
                margin-left: auto;
                margin-right: auto;
            }

            .container {
                min-width: 370px;
                /* min-height: 450px; */
                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);

                display: flex;
                flex-direction: column;

                -webkit-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -moz-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -o-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
            }

            header {
                border-bottom: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                padding: 1rem;
                margin: 1rem;
            }

            span.title {
                padding-right: 8px;
                margin-bottom: 0.2rem;
                color: var(--lumo-primary-text-color);
                font-size: var(--lumo-font-size-m);
                font-weight: 500;
            }

            table {
                padding: 1rem;
            }

            vaadin-select ([theme~="lemon"]) {
                font-size: var(--lumo-font-micro);
            }

            vaadin-select {
                font-size: var(--lumo-font-micro);
                width: 5rem;
            }
            #label-vaadin-select-1 {
                font-size: var(--lumo-font-micro);
            }

            footer {
                padding: 0.75rem 1.25rem;
                background-color: #f7f7f9;
                border-top: 1px solid rgba(0, 0, 0, 0.125);
                min-width: 100%;
                /* push footer to bottom */
                margin-top: auto;
                /* ensure width includes padding */
                box-sizing: border-box;
            }

            #expandShrink {
                margin-left: auto;
            }

            /* visible content */

            .ellipsis_cell > div {
                position: relative;
                overflow: hidden;
                height: 1em;
            }

            .ellipsis_cell > div > span {
                display: block;
                position: absolute;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1em; /* for vertical align of text */
            }

            /* cell stretching content */
            .ellipsis_cell > div:after {
                content: attr(title);
                overflow: hidden;
                height: 0;
                display: block;
            }

            ::slotted(div[slot="topCorner"]) {
                margin-left: auto;
            }

            ::slotted(div[slot="preTable"]) {
                margin: 0.1rem;
            }
        `,
    ];

    // -- Start of lifecycle methods -- //

    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
        if (this.width) {
            this.container.style.width = `${this.width}px`;
        }
        if (this.height) {
            this.container.style.height = `${this.height}px`;
        }
    }

    // -- Main Render -- //
    render() {
        return html`
            <div class="container-wrapper">
                <div class="container">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

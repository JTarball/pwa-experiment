import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";

import "./toggle-button";

@customElement("generic-help")
class GenericHelpElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @query(".tooltip-wrapper")
    tooltip?: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .help {
                margin-left: auto;
            }

            .tooltip-wrapper {
                /* display: inline-flex;
                visibility: hidden; */
                display: inline-block;
            }

            .tooltip {
                margin-left: 0px;
                box-shadow: rgb(34 40 42 / 48%) 0px 4px 20px -3px;
                font-family: inherit;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.25px;
                line-height: 16px;
                background-color: var(--lumo-tertiary-text-color);
                border-radius: 4px;
                color: white;
                max-width: 200px;
                padding: 16px 18px;
                /* position: relative; */
                overflow-wrap: break-word;

                position: relative;
                text-decoration: underline dotted;

                top: 50%;
                left: 100%;
                transform: translate(0, -50%);
                margin-left: 15px;

                z-index: 2;
            }

            .tooltip::after {
                top: 50%;
                margin-top: -6px;
            }

            .tooltip::after {
                border-width: 6px 6px 6px 0px;
                border-bottom-style: solid;
                border-bottom-color: transparent;
                border-left-style: initial;
                border-left-color: initial;
                border-right-style: solid;
                border-right-color: var(--lumo-tertiary-text-color);
                border-top-style: solid;
                border-top-color: transparent;
                right: 100%;
                content: "";
                height: 0px;
                width: 0px;
                position: absolute;
            }
        `,
    ];

    // -- Handle functions -- //
    private handleToggleHelp() {
        this.tooltip.style.visibility = this.tooltip.style.visibility == "hidden" ? "visible" : "hidden";
    }

    // -- Main Render -- //
    render() {
        return html`
            <div class="help">
                <vaadin-button @click=${this.handleToggleHelp} theme="icon" aria-label="Show help">
                    <vaadin-icon icon="vaadin:question-circle"></vaadin-icon>
                </vaadin-button>
                <span class="tooltip-wrapper">
                    <span class="tooltip"><slot></slot></span>
                </span>
            </div>
        `;
    }
}

// @click="${() => {
//     this.help._wrapper.classList.remove("closed");
// }}"

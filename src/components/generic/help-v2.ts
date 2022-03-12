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

@customElement("generic-helpv2")
class GenericHelpElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @query(".tooltip")
    tooltip?: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            /* .help {
                margin-left: auto;
            }

            .tooltip-wrapper {
                display: inline-flex;
                visibility: hidden; 
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
            } */
            /* .tooltip {
                font-size: 16px;
                font-weight: normal;
                margin-top: 2px;
                position: relative;

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

                overflow-wrap: break-word;

                text-decoration: underline dotted;

                transform: translate(0, -50%);
                margin-left: 15px;

                z-index: 2;
            }
            .tooltip:hover {
                cursor: help;
            }

            .tooltip-bg1 {
                background-color: #000;
                border-radius: 10px;
                content: " ";
                display: flex;
                height: 20px;
                position: absolute;
                top: 0;
                width: 20px;
            }
            .tooltip-bg2 {
                background-color: #fff;
                border-radius: 8px;
                content: " ";
                display: flex;
                height: 16px;
                left: 2px;
                position: absolute;
                top: 2px;
                width: 16px;
            }

            .info {
                color: #64686b;
            }
            .popup-bg {
                filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.16)) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.23));
                position: absolute;
                top: -126px;
            }
            .popup-outline {
                position: absolute;
                top: -126px;
            }
            .popup-text {
                border-radius: 12px;
                box-sizing: border-box;
                color: #fff;
                font-size: 16px;
                font-weight: normal;
                left: 8px;
                opacity: 1;
                padding: 12px 16px;
                position: absolute;
                top: 1px;
                transition: opacity 240ms 120ms cubic-bezier(0.4, 0, 0.2, 1);
                width: 292px;
            }
            .tooltip:hover ~ .popup-text {
                display: block;
            }
            .popup-bg {
                opacity: 0;
                transition: opacity 240ms 120ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            .popup-outline-left {
                stroke-dasharray: 0 426px;
                stroke-dashoffset: 1px;
                transition: stroke-dasharray 300ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            .popup-outline-right {
                stroke-dasharray: 352px 352px;
                stroke-dashoffset: -352px;
                transition: stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            .tooltip:hover ~ .popup-text {
                opacity: 1;
            }
            .tooltip:hover ~ .popup-bg {
                opacity: 1;
                transition: opacity 240ms 120ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            .tooltip:hover ~ .popup-outline .popup-outline-left {
                stroke-dasharray: 426px 426px;
                transition: stroke-dasharray 300ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            .tooltip:hover ~ .popup-outline .popup-outline-right {
                stroke-dashoffset: 0;
                transition: stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1);
            } */

            /* Help */
            .help {
            }

            .help:hover {
                cursor: help;
            }

            .tooltip {
                font-size: 16px;
                font-weight: normal;
    
                position: absolute

      
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

                overflow-wrap: break-word;

                text-decoration: underline dotted;

                z-index: 2;
                display: none;

                -webkit-transform: translateX(120px);
                -moz-transform: translateX(120px);
                transform: translateX(120px);
            }

            .tooltip[opened] {
                display: block;
                background-color: var(--lumo-tertiary-text-color);
            }

            /* Tooltip */
        `,
    ];

    // -- Handle functions -- //
    private handleToggleHelp() {
        if (this.tooltip?.hasAttribute("opened")) {
            this.tooltip?.removeAttribute("opened");
        } else {
            this.tooltip?.setAttribute("opened", null);
        }
    }

    // -- Main Render -- //
    render() {
        return html`
            <vaadin-horizontal-layout>
                <label class="label"> Notification </label>
                <vaadin-button class="help" @click=${this.handleToggleHelp} theme="icon" aria-label="Show help"><vaadin-icon icon="vaadin:question-circle"></vaadin-icon> </vaadin-button>
                <span class="tooltip">Severe Attack!</span>
            </vaadin-horizontal-layout>
            <!-- <div class="popup-text">Your photos are safely stored in a data center in your geographical zone only accessible by you. Don't worry. You're in good hands!</div> -->
        `;
    }
}

// @click="${() => {
//     this.help._wrapper.classList.remove("closed");
// }}"

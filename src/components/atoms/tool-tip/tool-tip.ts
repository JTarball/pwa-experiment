// Inspired by https://medium.com/carwow-product-engineering/building-a-simple-tooltip-component-that-never-goes-off-screen-c7039dcab5f9
//                       <!-- <tool-tip width="300" .text="${row["country"]} ${row["company_name"]}">${truncate(row["description"], 150)}</tool-tip> -->

import { LitElement, html, css, render } from "lit";
import { customElement, query, property } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/button";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../toggle-button/toggle-button";

@customElement("tool-tip")
export class ToolTip extends LitElement {
    // -- Start of state, properties, queries -- //

    // Set tooltip to show underneath
    @property({ type: Boolean, reflect: true })
    bottom: boolean = false;

    @property({ type: Number })
    width?;

    @property({ type: String })
    text: string;

    _root: Element;

    @query(".tooltip")
    tooltip: Element;

    @query(".text")
    _help: Element;

    @query(".tooltip-dropdown")
    dropdown: Element;

    @query(".tooltip-dropdown-content")
    _dropdown_content: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            @keyframes tooltipFadeIn {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            .tooltip {
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
                z-index: 1000;
            }

            .tooltip-button {
                cursor: help;
            }

            .tooltip[open] .tooltip-dropdown {
                animation: tooltipFadeIn 0.15s;
                display: block;
            }

            .tooltip-dropdown {
                display: none;
                position: absolute;
                bottom: 150%;
                z-index: 2000;
                padding-top: 32px;
                margin-top: 0.4em;
            }
            .tooltip[bottom] .tooltip-dropdown {
                top: 0;
                bottom: 0;
            }

            .tooltip-dropdown-content {
                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                /* border-radius: 4px; */
                padding: 8px 12px;
                min-width: 300px;
                text-align: left;
                background-color: var(--lumo-base-color);
                color: black;
                box-shadow: rgb(34 40 42 / 48%) 0px 4px 10px -3px;
                font-family: inherit;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.25px;
            }
        `,
    ];

    // -- Lifecycle functions -- //

    connectedCallback() {
        super.connectedCallback();

        this._root = this.getRootNode();
        console.log("salkjdljakd", this._root);
    }

    firstUpdated() {
        if (this.bottom) {
            this.tooltip.setAttribute("bottom", "");
        }
        if (this.width) {
            this._dropdown_content.style.width = `${this.width}px`;
        }

        // if (this._root) {
        //     if (this._root) {
        //         let el = document.createElement("my-element");
        //         document.body.appendChild(el);
        //         el.innerHTML = `

        // <div class="tooltip-dropdown">
        //     <div class="tooltip-dropdown-content">
        //         <slot></slot>
        //     </div>
        // </div>;

        //         `;
        // }
    }

    // -- Basic Functionality function -- //

    private handleDropdownPosition() {
        const screenPadding = 16;

        const placeholderRect = this._help.getBoundingClientRect();
        const dropdownRect = this.dropdown.getBoundingClientRect();

        const dropdownRightX = dropdownRect.x + dropdownRect.width;
        const placeholderRightX = placeholderRect.x + placeholderRect.width;

        if (dropdownRect.x < 0) {
            this.dropdown.style.left = "0";
            this.dropdown.style.right = "auto";
            this.dropdown.style.transform = `translateX(${-placeholderRect.x + screenPadding}px)`;
        } else if (dropdownRightX > window.outerWidth) {
            this.dropdown.style.left = "auto";
            this.dropdown.style.right = "0";
            this.dropdown.style.transform = `translateX(${window.outerWidth - placeholderRightX - screenPadding}px)`;
        }
    }

    private open() {
        this.tooltip?.setAttribute("open", null);
        this.handleDropdownPosition();
    }

    private close() {
        console.log("close");
        this.tooltip?.removeAttribute("open");
    }

    // -- Main Render -- //
    render() {
        return html`
            <!--  @mouseout=${this.close} -->
            <span class="tooltip" @mouseover=${this.open}>
                <span class="text">${this.text}</span>
                <div class="tooltip-dropdown">
                    <div class="tooltip-dropdown-content">
                        <slot></slot>
                    </div>
                </div>
            </span>
        `;
    }
}

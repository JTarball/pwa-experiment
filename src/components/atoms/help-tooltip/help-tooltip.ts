// Inspired by https://medium.com/carwow-product-engineering/building-a-simple-tooltip-component-that-never-goes-off-screen-c7039dcab5f9

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

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../toggle-button/toggle-button";

@customElement("help-tooltip")
class HelpTooltip extends LitElement {
    // -- Start of state, properties, queries -- //

    @query(".tooltip")
    tooltip: Element;

    @query(".tooltip-button")
    help: Element;

    @query(".tooltip-dropdown")
    dropdown: Element;

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
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                z-index: 2;
                padding-top: 32px;
                margin-top: 0.4em;
            }

            .tooltip-dropdown-content {
                border-radius: 4px;
                padding: 8px 12px;
                width: 300px;
                text-align: left;
                background-color: var(--google-grey-500);
                color: white;
                box-shadow: rgb(34 40 42 / 48%) 0px 4px 20px -3px;
                font-family: inherit;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.25px;
            }
        `,
    ];

    // -- Lifecycle functions -- //
    constructor() {
        super();

        // document.addEventListener("click", (event) => {
        //     const withinBoundaries = event.composedPath().includes(this.dropdown);

        //     if (withinBoundaries) {
        //         console.log("Click happened inside element");
        //     } else {
        //         console.log("Click happened OUTSIDE the element");
        //         if (this.tooltip?.hasAttribute("open")) {
        //             console.log("closing");
        //             this.close();
        //         }
        //         //this.close();
        //     }
        // });
    }

    // -- Basic Functionality function -- //

    private handleDropdownPosition() {
        const screenPadding = 16;

        const placeholderRect = this.help.getBoundingClientRect();
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

    // private createOneTimeListener(element, event, listener) {
    //     // first we call addEventListener on element with event name
    //     // then inside the callback function, we first un-register the listener
    //     // and return the original listener passed to attach it with the event
    //     element.addEventListener(event, function () {
    //         element.removeEventListener(event, arguments.callee);
    //         return listener();
    //     });
    // }

    private toggle(e: Event) {
        e.stopPropagation();
        if (this.tooltip?.hasAttribute("open")) {
            this.close();
        } else {
            // this.createOneTimeListener(document, "click", function () {
            //     alert("Thanks for clicking");
            // });
            this.open();
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

    // private extraClose(event: Event, tooltip: Element) {
    //     console.log("extraClose");
    //     const withinBoundaries = event.composedPath().includes(this.dropdown);
    //     console.log("withinBoundaries", withinBoundaries);
    //     if (!withinBoundaries) {
    //         console.log("outside close");
    //         // one time event listener
    //         //document.removeEventListener(event, arguments.callee);
    //         tooltip?.removeAttribute("open");
    //     }
    // }

    // -- Main Render -- //
    render() {
        return html`
            <span class="tooltip" @click=${this.toggle}>
                <vaadin-button class="tooltip-button" theme="icon" aria-label="Show help"><vaadin-icon icon="vaadin:question-circle"></vaadin-icon></vaadin-button>
                <div class="tooltip-dropdown">
                    <div class="tooltip-dropdown-content">
                        <slot></slot>
                    </div>
                </div>
            </span>
        `;
    }
}

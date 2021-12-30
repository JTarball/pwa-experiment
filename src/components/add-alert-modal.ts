/* Full Page Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import { FormLayoutResponsiveStep } from "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { UserStock } from "../store/models.js";

import "./add-alert-form";

@customElement("addalert-modal")
class AddAlertModal extends LitElement {
    /* Properties */

    @property()
    stock: UserStock; // The current stoock

    @property()
    title: String = "";

    @property({ type: Boolean, reflect: false })
    open: boolean = false;

    @query(".wrapper")
    _wrapper: Element;

    // Price Target  ->
    // Price Change ->
    // Percent Change from Now ->  decrease/increase/both

    // Trailing Stop  -> Percent / Price Difference
    // Trailing High -> Percent / Difference
    // ---------
    // Earnings Alert ->
    // Time Review Alert -> time { REVIEW_ONE_MONTH = 0; REVIEW_THREE_MONTH = 1; REVIEW_SIX_MONTH = 2; REVIEW_ONE_YEAR = 3; REVIEW_FIVE_YEAR = 3; }
    // Technicals -> p/e ratio or peg ratio

    @state()
    items = [
        { title: "Target Price", description: "Select a specific price to alert on", icon: "vaadin:book-dollar" },
        { title: "Change Price", description: "Alerts on a price difference compared to the current price.", icon: "vaadin:plus-minus" },
        { title: "Change Percent", description: "Alerts on a percent difference compared to the current price", icon: "vaadin:book-percent" },
        { skip: true },
        { title: "Trailing Stop", description: "Select a price to alert on", icon: "vaadin:trending-down" },
        { title: "Trailing High", description: "Select a price to alert on", icon: "vaadin:trending-up" },
        { skip: true },
        { title: "Earnings Alert", description: "Alert on an earnings call", icon: "vaadin:calendar-briefcase" },
        { title: "Time Review Alert", description: "Notification for a specific time in the future e.g. to review a stock position", icon: "vaadin:time-forward" },
        { title: "Technicals", description: "Alert on a specific technical indicator e.g. peg ratio, pe ratio ..", icon: "vaadin:chart-grid" },
    ];

    @state()
    items_child_trailing_stop = [
        { parent: "Trailing Stop", title: "Percent", description: "Select a price to alert on", icon: "vaadin:book-percent" },
        { parent: "Trailing Stop", title: "Price", description: "Select a price to alert on", icon: "vaadin:arrows-long-up" },
    ];

    @state()
    items_child_target_price = [
        { parent: "Target Price", title: "On Rises", description: "Triggers on when the prices rises above the target price.", icon: "vaadin:arrow-up", onClick: this.showForm },
        { parent: "Target Price", title: "On Falls", description: "Triggers on when the prices falls below the target price.", icon: "vaadin:arrow-down" },
    ];

    @state()
    items_current;

    @state()
    title_current: String = "Add alert";

    /* End of properties, queries etc. */

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            /* Wrapper */
            .wrapper {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                z-index: 100;
                background-color: var(--lumo-base-color);
            }

            .wrapper:not(.open) {
                animation: slideFromTop 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                visibility: hidden;
            }

            .wrapper.open {
                opacity: 1;
                visibility: visible;
                animation: 0.08s 0.03s slideFromBottom cubic-bezier(0.215, 0.61, 0.355, 1) both;
            }

            .wrapper.closing {
                animation: slideFromTop 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            }

            @keyframes slideFromBottom {
                0% {
                    transform: translateY(90%);
                }
                100% {
                    transform: translateY(0);
                }
            }

            @keyframes slideFromTop {
                0% {
                    transform: translateY(5%);
                }
                100% {
                    transform: translateY(100%);
                }
            }
            /* End of Wrapper */

            header {
                display: flex;
                align-items: center;
                height: 53px;
                padding: 0 1rem;
            }

            .content {
                padding-left: 5px;
                padding-right: 5px;
            }

            /* Icon */
            #close {
                height: 24px;
                color: var(--lumo-secondary-text-color);
                margin-left: 8px;
                margin-right: 8px;
                font-size: 16px;
                width: 44px;
            }

            #title {
                text-align: left;
                width: 300px;
            }
        `,
    ];

    private firstUpdated() {
        this.items_current = this.items;
    }

    private handleOptionClick(e: Event, item) {
        console.log("handleOptionClick,");

        switch (item.title) {
            case "Target Price":
                console.log("From trailing stop");
                this.items_current = this.items_child_target_price;
                this.title_current = item.title;
                break;
            case "Trailing Stop":
                console.log("From trailing stop");
                this.items_current = this.items_child_trailing_stop;
                this.title_current = item.title;
                break;
            default:
        }
    }

    private addOptionsTableRender() {
        return html`
            <table>
                <thead>
                    <tr>
                        <th style="vertical-align: bottom;">
                            <span class="headerTitle">${this.title_current}</span>
                        </th>
                        <th></th>
                    </tr>
                    <thead></thead>
                </thead>
                ${this.items_current?.map((item, index) => {
                    return html`
                        <tr role="row" index="${index}" @click=${(e) => this.handleOptionClick(e, item)}>
                            <td style="width: 65%;">
                                ${item.skip
                                    ? html``
                                    : html` <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                          <vaadin-icon icon=${item.icon || "vaadin:arrows-long-v"} theme="xsmall"></vaadin-icon>
                                          <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                              <span class="title">${item.title} </span>
                                              <span class="description">${item.description}</span>
                                          </vaadin-vertical-layout>
                                      </vaadin-horizontal-layout>`}
                            </td>

                            <td style="width: 10%;">
                                <!-- <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                    <vaadin-button id="addToWatch">Add to watch</vaadin-button>
                                </vaadin-vertical-layout> -->
                            </td>
                        </tr>
                    `;
                })}
            </table>
        `;
    }

    private showForm() {}

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        { minWidth: 0, columns: 1 },
        { minWidth: "20em", columns: 3 },
    ];

    private formRender() {
        return html` <addalert-form .stock=${this.stock}></addalert-form> `;
    }

    render() {
        return html`
            <div class="wrapper ${this.open ? "open" : ""}">
                <header class="bg-base border-b border-contrast-10 box-border flex h-xl items-center w-full" slot="navbar">
                    <vaadin-icon
                        id="close"
                        icon="lumo:angle-left"
                        @click=${() => {
                            // this._wrapper.classList.add("closing");
                            // // Lazy way to wait for css slide out transition
                            // setTimeout(() => {
                            //     const closed = new CustomEvent("closed", {
                            //         detail: {
                            //             value: false,
                            //         },
                            //     });
                            //     this.dispatchEvent(closed);
                            //     this._wrapper.classList.remove("closing");
                            // }, 500);
                        }}
                    ></vaadin-icon>
                    <vaadin-vertical-layout class="m-auto" style="line-height: var(--lumo-line-height-m);">
                        <span id="title">${this.title}</span>
                    </vaadin-vertical-layout>
                    <vaadin-icon
                        id="close"
                        icon="lumo:cross"
                        @click=${() => {
                            this._wrapper.classList.add("closing");

                            // Lazy way to wait for css slide out transition
                            setTimeout(() => {
                                const closed = new CustomEvent("closed", {
                                    detail: {
                                        value: false,
                                    },
                                });
                                this.dispatchEvent(closed);
                                this._wrapper.classList.remove("closing");
                            }, 500);
                        }}
                    ></vaadin-icon>
                </header>

                <div id="content" class="content">
                    <!-- ${this.addOptionsTableRender()} -->
                    ${this.formRender()}

                    <slot></slot>
                </div>
            </div>
        `;
    }
}

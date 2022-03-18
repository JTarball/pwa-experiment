/* Full Page Modal */
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

import { themeStyles } from "../../themes/yld0-theme/styles.js";

@customElement("modal-slide-up")
class ModalSlideUp extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    item: Object; // Generic object

    @property()
    title: String = "";

    @property({ type: Boolean, reflect: false })
    open: boolean = false;

    @query(".wrapper")
    _wrapper: Element;

    // -- End of properties, queries etc. -- //

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
                z-index: 900;
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
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

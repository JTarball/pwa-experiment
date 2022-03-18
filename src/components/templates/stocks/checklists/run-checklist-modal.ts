import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/icon";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/menu-bar";
import { FormLayoutResponsiveStep } from "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../../themes/yld0-theme/styles.js";

import "../../../atoms/input/input"; // text-input
import "../../../atoms/toggle-group/toggle-group";

@customElement("run-checklist-modal")
export class RunChecklistModal extends LitElement {
    /* Properties */

    @property({ type: Boolean, reflect: true })
    preview: boolean = false;

    @property({ type: Object })
    checklist: Object;

    @state()
    title: String = "Preview Checklist";

    @property({ type: Boolean, reflect: false })
    open: boolean = false; // modal open

    @query(".wrapper")
    _wrapper: Element;

    // --- End of properties, queries etc. --- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            /* Wrapper */
            .wrapper {
                position: absolute;
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

            #close {
                cursor: pointer;
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

            .container {
                justify-content: space-between;
                display: flex;
                flex-direction: row;
            }

            .sideBar {
                min-height: 100vh;
                flex-shrink: 1;
                width: 80px;
                border-right: 1px solid rgba(230, 230, 230, 1);
            }

            .mainBar {
                flex: 1 1 auto;
                padding: 1rem;
            }

            h4 {
                color: var(--lumo-secondary-text-color);
            }

            table td {
                cursor: default;
            }
        `,
    ];

    // -- Handlers -- //

    handleClose() {
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
    }

    // -- Other Renders -- //

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        { minWidth: 0, columns: 1 },
        { minWidth: "20em", columns: 1 },
    ];

    private renderRow(item, index) {
        switch (item.type) {
            case "question":
                return html`
                    <tr role="row" index="${index}">
                        <td style="width: 100%;">
                            <h2>${item.title}</h2>
                            <span>${item.info}</span>
                            <text-area theme="no-border no-focus-border" label="Your Answer" placeholder="Preview: your answer will go here" style="margin-top: 2rem;"></text-area>
                        </td>
                    </tr>
                `;
                break;
            case "boolean":
                return html`
                    <tr role="row" index="${index}">
                        <td style="width: 99%;">
                            <vaadin-vertical-layout style="align-items:center;">
                                <h2>${item.title}</h2>
                                <span>${item.info}</span>
                                <toggle-group label="Your Answer" .items=${item.choices}></toggle-group>
                            </vaadin-vertical-layout>
                        </td>

                        <td style="width: 1%;"></td>
                    </tr>
                `;
                break;
            case "multiple":
                return html`
                    <tr role="row" index="${index}">
                        <td style="width: 100%;">
                            <vaadin-vertical-layout style="align-items:center;">
                                <h2>${item.title}</h2>
                                <span>${item.info}</span>
                                <toggle-group label="Your Answer" .items=${item.choices}></toggle-group>
                            </vaadin-vertical-layout>
                        </td>
                    </tr>
                `;
                break;
            default:
                return html``;
        }
    }

    private renderForm() {
        return html`
            <div class="container">
                <!-- Side Power Menu -->
                <div class="sideBar"></div>
                <!-- Main Content -->
                <div class="mainBar">
                    <h2 class="formHeader">${this.checklist?.name}</h2>
                    <span style="margin-bottom: 2rem;">${this.checklist?.description}</span>
                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <table class="yld0" style="margin-bottom: 0px; padding-bottom: 1rem;">
                            <thead>
                                <tr style="border-color: var(--lumo-contrast-10pct);border-bottom-style: solid;border-bottom-width: 1px;"></tr>
                            </thead>
                            <tr style="border: none;"></tr>

                            ${this.checklist?.checklist.map((item, index) => {
                                return html`${this.renderRow(item, index)}`;
                            })}
                        </table>
                    </vaadin-form-layout>
                </div>
            </div>
        `;
    }

    // -- Main Render -- //
    render() {
        console.log("render, ", this.checklist);
        return html`
            <div class="wrapper ${this.open ? "open" : ""}">
                <header class="bg-base border-b border-contrast-10 box-border flex h-xl items-center w-full" slot="navbar">
                    <vaadin-vertical-layout class="m-auto" style="line-height: var(--lumo-line-height-m);">
                        <span id="title">${this.checklist?.name ? html`${this.title} - '${this.checklist.name}'` : html`${this.title}`}</span>
                    </vaadin-vertical-layout>
                    <vaadin-icon id="close" icon="lumo:cross" @click=${this.handleClose}></vaadin-icon>
                </header>
                <section>
                    <div id="content" class="content">
                        ${this.renderForm()}
                        <slot></slot>
                    </div>
                </section>
            </div>
        `;
    }
}

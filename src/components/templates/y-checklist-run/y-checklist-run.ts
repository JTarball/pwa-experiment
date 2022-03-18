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

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../../atoms/input/input"; // text-input
import "../../atoms/toggle-group/toggle-group";

import "../../organisms/modal-up/modal-up";

@customElement("y-checklist-run")
export class RunChecklistModal extends LitElement {
    /* Properties */

    @property({ type: Boolean, reflect: true })
    preview: boolean = false;

    @property({ type: Object })
    checklist: Object;

    @state()
    title: string = "Preview Checklist";

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

            table td {
                cursor: default;
            }
        `,
    ];

    // -- Handlers -- //

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
        console.debug("render, ", this.checklist);
        return html`
            <modal-up
                ?open=${this.open}
                title="checklist ${this.preview ? "preview" : "run"}"
                @closed=${(e) => {
                    const closed = new CustomEvent("closed", {
                        detail: {
                            value: false,
                        },
                    });
                    this.dispatchEvent(closed);
                }}
            >
                ${this.renderForm()}
            </modal-up>
        `;
    }
}

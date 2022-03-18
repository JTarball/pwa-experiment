import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import { guard } from "lit/directives/guard.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import "@vaadin/dialog";
// import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
// import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

@customElement("delete-confirm")
class DeleteConfirm extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    header: String;

    @property()
    contextItem: Object;

    @property()
    description: String = "Are you sure you want to delete this item?";

    @property({ type: Boolean })
    open?;

    // -- End of properties, queries etc. -- //

    static styles = [
        spacing,
        themeStyles,
        css`
            #confirm {
                color: var(--lumo-error-color);
            }
        `,
    ];

    // -- Other functions -- //

    private handleConfirm(e: Event) {
        const confirm = new CustomEvent("confirm", {
            detail: {
                value: true,
            },
        });
        this.dispatchEvent(confirm);
        this.open = false;
    }

    // -- Main Render -- //
    render() {
        return html`
            <vaadin-dialog
                theme="no-padding"
                aria-label="Create new employee"
                .opened="${this.open}"
                @opened-changed="${(e: CustomEvent) => (this.open = e.detail.value)}"
                .renderer="${guard([], () => (root: HTMLElement) => {
                    render(
                        html`
                            <vaadin-vertical-layout style="align-items: stretch; height: 100%; max-height: 420px; max-width: 400px;">
                                <h3 style="font-weight: 600; margin: 0; padding: 1rem 1rem 0.1rem 1rem; ">${this.header}</h3>
                                <p style="font-size: var(--lumo-font-size-xs); padding-left: 1rem; padding-right: 1rem; padding-bottom: 1rem;">${this.description}</p>
                                <footer style="background-color: var(--lumo-contrast-5pct); padding: 1rem 2rem; text-align: right;">
                                    <vaadin-button
                                        theme="tertiary"
                                        style="float: left;"
                                        @click="${() => {
                                            this.open = false;
                                            const cancel = new CustomEvent("cancel", {
                                                detail: {
                                                    value: this.contextItem,
                                                },
                                            });
                                            this.dispatchEvent(cancel);
                                        }}"
                                    >
                                        Cancel
                                    </vaadin-button>
                                    <vaadin-button
                                        id="confirm"
                                        theme="primary error"
                                        @click="${() => {
                                            this.open = false;
                                            const confirm = new CustomEvent("confirm", {
                                                detail: {
                                                    value: this.contextItem,
                                                },
                                            });
                                            this.dispatchEvent(confirm);
                                        }}"
                                    >
                                        Delete
                                    </vaadin-button>
                                </footer>
                            </vaadin-vertical-layout>
                        `,
                        root
                    );
                })}"
            ></vaadin-dialog>
        `;
    }
}

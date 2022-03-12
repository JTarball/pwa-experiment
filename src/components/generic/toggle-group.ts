import { LitElement, html, css, render } from "lit";
import { customElement, queryAll, property, state } from "lit/decorators.js";
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
import "../generic/help-tooltip";

@customElement("toggle-group")
class ToggleGroupElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    label: string = "";

    @property({ type: Boolean, reflect: true })
    helpButton: boolean = false;

    @property({ type: Boolean, reflect: true })
    selectMany: boolean = false;

    @property({ type: Array })
    items: [Object?] = [];

    @queryAll("toggle-button")
    _buttons?: [Element];

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .wrapper {
                display: inline-block;
            }

            .label {
                color: var(--lumo-secondary-text-color);
                font-weight: 500;
                font-size: var(--lumo-font-size-micro);
                transition: color 0.2s ease 0s;
                line-height: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: 100%;
                box-sizing: border-box;
                display: inline-flex;
                align-items: center;
            }
        `,
    ];

    // -- Handle functions -- //
    private handleSetSelected(item: Object) {
        if (!this.selectMany) {
            // If not selecting many, we need to override
            // toggle-button behaviour

            Array.from(this._buttons).forEach((el: Element, i) => {
                el.removeAttribute("selected");

                if (item.id == el.id) {
                    el.setAttribute("selected", null);
                }
            });
        }

        let itemsSelected = [];
        Array.from(this._buttons).forEach((el: Element, i) => {
            if (el.hasAttribute("selected")) {
                itemsSelected.push(el.id);
            }
        });

        var event = new CustomEvent("selected-change", { detail: { value: itemsSelected } });
        this.dispatchEvent(event);
    }

    // -- Main Render -- //
    render() {
        return html`
            <div class="wrapper">
                <vaadin-horizontal-layout>
                    <label class="label">${this.label}</label>
                    ${this.helpButton
                        ? html` <help-tooltip>
                              <slot name="help"></slot>
                              <!-- <p>One-off: Sends one alert, and will eventually be removed by the system if not renabled.</p>
                        <p>Repeating Alert: Sends one alert and then resets the alert thus the alert is repeating.</p> -->
                          </help-tooltip>`
                        : html`<div style="padding: 1rem;"></div>`}
                </vaadin-horizontal-layout>

                ${this.items?.map((item, index) => {
                    console.log("temp,", item);
                    return html`
                        <toggle-button
                            index=${index}
                            id="${item.id}"
                            @click=${() => {
                                this.handleSetSelected(item);
                            }}
                            ?outline=${this.selectMany}
                            ?selected=${item.selected}
                            .backgroundColor=${item.background_color}
                        >
                            ${item.label}
                        </toggle-button>
                    `;
                })}
            </div>
        `;
    }
}

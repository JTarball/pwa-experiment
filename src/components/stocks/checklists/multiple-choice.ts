import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/menu-bar";

import "../../generic/input";
import "../../generic/toggle-group";

@customElement("multiple-choice")
export class MultipleChoiceAnswer extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Array })
    multiple_choice = [
        { id: "A", label: "A", selected: true }, // if you change this remember to adjust this.repeated
        { id: "B", label: "B", selected: false },
        { id: "C", label: "C", selected: false },
        { id: "D", label: "D", selected: false },
    ];

    lastID: string = "D"; // Last ID used

    // -- End of properties, queries etc. -- //

    //static styles = [badge, utility, spacing, themeStyles, css``];

    // -- Handle or utlity functions -- //
    private _createItem() {
        const item = document.createElement("vaadin-context-menu-item");
        const icon = document.createElement("vaadin-icon");
        item.setAttribute("aria-label", "Other save options");
        icon.setAttribute("icon", `vaadin:ellipsis-dots-v`);
        item.appendChild(icon);
        return item;
    }

    private nextLetter(s: string) {
        return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function (a) {
            var c = a.charCodeAt(0);
            switch (c) {
                case 90:
                    return "A";
                case 122:
                    return "a";
                default:
                    return String.fromCharCode(++c);
            }
        });
    }

    async handleMenuAction(e: Event, id: string) {
        switch (e.detail.value.text) {
            case "Duplicate":
                var filtered = this.multiple_choice.filter(function (el) {
                    return el.id == id;
                });
                const letter = this.nextLetter(this.lastID);
                const newItem = { ...filtered[0], id: letter };
                this.multiple_choice = [...this.multiple_choice, newItem];
                this.lastID = letter;
                break;

            case "Delete":
                var filtered = this.multiple_choice.filter(function (el) {
                    return el.id != id;
                });
                this.multiple_choice = filtered;
                break;
        }
    }

    // -- Other Renders -- //

    renderMenu(id: string) {
        var items = [
            {
                component: this._createItem(),
                children: [{ text: "Duplicate" }, { text: "Delete" }],
            },
        ];
        return html` <vaadin-menu-bar style="z-index: -1;" theme="icon" .items="${items}" @item-selected=${async (e) => this.handleMenuAction(e, id)}></vaadin-menu-bar>`;
    }
    // -- Main Render -- //
    render() {
        return html`
            <span style="color: var(--lumo-secondary-text-color);">Multiple Choice Answers</span>

            ${this.multiple_choice.map((item, _) => {
                return html`
                    <vaadin-horizontal-layout>
                        <span>
                            <div style="width: 75%;">
                                <text-input
                                    value="${item.label}"
                                    theme="no-border"
                                    backgroundColor="#F3F6F9"
                                    @on-change=${(e) => {
                                        let new_multiple_choice = this.multiple_choice.map((element) => (element.id == item.id ? { ...element, label: e.detail.value } : element));
                                        this.multiple_choice = new_multiple_choice;
                                        var event = new CustomEvent("on-change", { detail: { value: this.multiple_choice } });
                                        this.dispatchEvent(event);
                                    }}
                                ></text-input>
                            </div>
                        </span>
                        <span> ${this.renderMenu(item.id)} </span>
                    </vaadin-horizontal-layout>
                `;
            })}

            <toggle-group label="Preview Answer" .items=${this.multiple_choice}></toggle-group>
        `;
    }
}

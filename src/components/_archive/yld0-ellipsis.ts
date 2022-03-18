import { html, LitElement, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/menu-bar";

import { themeStyles } from "../../themes/yld0-theme/styles.js";

// Not happy with the styling of this but cant seem to change it
// A complete reread is what we should do from scratch!

@customElement("yld0-ellipsis")
export class YLDO0Ellipsis extends LitElement {
    @property()
    items = [];

    static styles = [
        themeStyles, // Table styling and a few extras
        css`
            :host {
                width: 20px;
            }
        `,
    ];

    @state()
    private items = [
        {
            component: this.createMenuItem(),
            children: [{ text: "Suggest new feature" }, { text: "Delete" }],
        },
    ];

    private handleMenu(e: Event) {
        var event = new CustomEvent("item-selected", { detail: { text: e.detail.value.text } });
        this.dispatchEvent(event);
    }

    render() {
        return html`<vaadin-menu-bar @item-selected=${this.handleMenu} theme="icon" .items="${this.items}"></vaadin-menu-bar>`;
    }

    private createMenuItem() {
        const item = document.createElement("vaadin-icon");
        item.setAttribute("aria-label", "Other  options");
        item.setAttribute("icon", `vaadin:ellipsis-dots-v`);

        return item;
    }
}

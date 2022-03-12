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

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

@customElement("container-item")
export class ContainerCellItem extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    image_url: String;

    @property()
    value: String;

    // -- End of properties, queries etc. -- //

    static styles = [badge, utility, spacing, themeStyles, css``];

    // -- Lifecycle function -- //

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        return html`<vaadin-avatar img="${this.image_url}" name="${this.value}" theme="xsmall"></vaadin-avatar>${this.value} `;
    }
}

import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

/**
 * Generic toggle button
 *
 * @param  {boolean}    disabled    -  Disabled the input from user interaction
 * @param  {boolean}    selected    -  If the button is selected
 * @param  {boolean}    outline     -  If set the theme outlines selected rather than fills with colour. This is a better ui experience with toggle-group and manySelected.
 *
 *
 */
@customElement("toggle-button")
class ToggleButtonElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: true })
    disabled: boolean = false;

    @property({ type: Boolean, reflect: true })
    selected: boolean = false;

    @property({ type: Boolean, reflect: true })
    outline: boolean = false;

    @property({ type: String })
    backgroundColor: string = "";

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            vaadin-button {
                background-color: var(--lumo-contrast-5pct);
                float: left;
                margin: 0.1em;
            }

            .toggleSelected {
                background-color: var(--lumo-contrast);
                color: white;
            }

            .toggleSelectedOutline {
                /* background-color: var(--lumo-contrast); */
                /* color: white; */
                border: 2px solid var(--lumo-contrast);
            }
        `,
    ];

    // -- Handle functions -- //
    private handleSetSelected(e: Event) {
        this.selected = !this.selected;
    }

    // -- Main Render -- //
    render() {
        const styles = this.selected ? { "background-color": this.backgroundColor } : {};
        const classes = { toggleSelected: this.selected && !this.outline, toggleSelectedOutline: this.selected && this.outline };
        return html` <vaadin-button style=${styleMap(styles)} class="${classMap(classes)}" theme="contrast" @click="${() => this.handleSetSelected()}"><slot></slot></vaadin-button> `;
    }
}

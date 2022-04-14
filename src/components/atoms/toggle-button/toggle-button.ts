import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import "@vaadin/button";
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
export class ToggleButtonElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: true })
    disabled: boolean = false;

    @property({ type: Boolean, reflect: true })
    selected: boolean = false;

    @property({ type: Boolean, reflect: true })
    outline: boolean = false;

    @property({ type: String })
    backgroundColor: string = "";

    @property({ type: String })
    theme: string = "";

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            vaadin-button {
                font-family: var(--lumo-font-family);
                font-weight: 500;
                color: var(--_lumo-button-color, var(--lumo-primary-text-color));
                background-color: var(--lumo-contrast-5pct);
                float: left;
                margin: 0.1em;
            }

            .toggleSelected {
                background-color: var(--lumo-contrast);
                color: white;
            }

            .toggleNotSelectedOutline {
                border: 2px solid var(--lumo-base-color); /* So the button doesnt move when outlined (selected) */
            }

            .toggleSelectedOutline {
                /* background-color: var(--lumo-contrast); */
                /* color: white; */
                color: var(--lumo-contrast);
                border: 2px solid var(--lumo-contrast);
            }

            .xsmall {
                font-size: 10px;
            }

            .small {
                font-size: var(--lumo-font-size-s);
            }
        `,
    ];

    // -- Handle functions -- //
    private handleSetSelected(e: Event) {
        this.selected = !this.selected;
        var event = new CustomEvent("selected-changed", { detail: { selected: this.selected } });
        this.dispatchEvent(event);
    }

    // -- Main Render -- //
    render() {
        const styles = this.selected ? { "background-color": this.backgroundColor } : {};
        const classes = {
            toggleSelected: this.selected && !this.outline,
            toggleNotSelectedOutline: !this.selected && this.outline,
            toggleSelectedOutline: this.selected && this.outline,
            small: this.theme.includes("small"),
            xsmall: this.theme.includes("xsmall"),
        };
        return html` <vaadin-button style=${styleMap(styles)} class="${classMap(classes)}" theme="contrast" @click="${() => this.handleSetSelected()}"><slot></slot></vaadin-button> `;
    }
}

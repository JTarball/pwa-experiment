import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
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

/**
 * Generic number and currency input with added meta
 *
 * @param  {boolean}    disabled    -  Disabled the input from user interaction
 * @param  {boolean}    error       -  Highlights the input has an error
 * @param  {string}     prefix      -  A string which is added to input as a prefix. Useful for currency inputs e.g. USD, $
 * @param  {string}     suffix      -  A string which is added to input as a suffix
 * @param  {string}     label       -  The input's label
 * @param  {string}     placeholder -  The input's placeholder
 * @param  {string}     value       -  The input's value
 * @param  {string}     meta        -  Meta information, displayed horizontal to the input. This can be used to provide the user
 *                                     extra information that could aid in entering a value
 * @param  {string}     metaClass   -  Inbuilt styling for the meta information either 'meta-success' or 'meta-error'. The default
 *                                     styling is selected when metaClass is ''.
 *
 */
@customElement("text-area")
class TextAreaElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: true })
    disabled: boolean = false;

    @property({ type: Boolean, reflect: true })
    error: boolean = false;

    @property({ type: String })
    prefix: string = "";

    @property({ type: String })
    suffix: string = "";

    @property({ type: String })
    label: string = "";

    @property({ type: String })
    placeholder: string = "";

    @property({ type: String })
    value: string = "";

    @property({ type: String })
    meta: string = "";

    @property({ type: String })
    metaClass: string = "";

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .textArea {
                margin-top: 30px;
                width: 100%;
            }

            .text {
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.15px;
                line-height: 20px;
                background-color: white;
                border-color: rgb(172, 181, 185);
                border-radius: 4px;
                border-style: solid;
                border-width: 1px;
                color: rgb(35, 39, 41);
                display: block;
                font-family: inherit;
                height: 36px;
                width: 90%;
                min-height: 64px;
                padding: 8px 12px;
                resize: none;
            }

            .disabled {
                background-color: rgb(238, 240, 241);
                border-color: rgb(172, 181, 185);
                color: rgb(106, 118, 124);
                -webkit-text-fill-color: rgb(106, 118, 124);
                opacity: 1;
            }

            .error {
                border-bottom-color: var(--lumo-error-color);
                border-left-color: var(--lumo-error-color);
                border-right-color: var(--lumo-error-color);
                border-top-color: var(--lumo-error-color);
            }

            .text-area-label {
                align-self: flex-start;
                color: var(--lumo-secondary-text-color);
                font-weight: 500;
                font-size: var(--lumo-font-size-micro);
                margin-left: calc(var(--lumo-border-radius-m) / 4);
                transition: color 0.2s;
                line-height: 1;
                padding-right: 1em;
                padding-bottom: 1em;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                position: relative;
                max-width: 80%;
                box-sizing: border-box;
                top: -5px;
            }
        `,
    ];

    // -- Handle functions -- //
    private handleOnChange(e: Event) {
        var event = new CustomEvent("on-change", { detail: { value: e.srcElement.value } });
        this.dispatchEvent(event);
    }

    // -- Main Render -- //
    render() {
        const classes = { text: true, disabled: this.disabled, error: this.error };

        return html`
            <div class="textArea">
                <label class="text-area-label" for="target">${this.label}</label>
                <textarea name="target" class="${classMap(classes)}" rows="4" cols="50"></textarea>
            </div>
        `;
    }
}

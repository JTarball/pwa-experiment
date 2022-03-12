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
@customElement("text-input")
class TextInputElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: true })
    startFocused?: boolean;

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
    value: string;

    @property({ type: String })
    meta: string = "";

    @property({ type: String })
    metaClass: string = "";

    @property({ type: String })
    backgroundColor: string = "";

    @property({ type: String })
    theme: string = "";

    @query("input#input")
    private _input?: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .wrapper {
                padding: 0.5em;
            }

            .numberInput {
                border-bottom-color: rgb(0, 0, 0);
                border-bottom-style: none;
                border-bottom-width: 0px;
                border-image-outset: 0;
                border-image-repeat: stretch;
                border-image-slice: 100%;
                border-image-source: none;
                border-image-width: 1;
                border-left-color: rgb(0, 0, 0);
                border-left-style: none;
                border-left-width: 0px;
                border-right-color: rgb(0, 0, 0);
                border-right-style: none;
                border-right-width: 0px;
                border-top-color: rgb(0, 0, 0);
                border-top-style: none;
                border-top-width: 0px;
                box-sizing: border-box;
                color: rgb(0, 0, 0);
                display: block;
                font-family: Inter, Noto, Arial, sans-serif;
                font-size: 16px;
                font-stretch: 100%;
                font-style: normal;
                font-variant-caps: normal;
                font-variant-east-asian: normal;
                font-variant-ligatures: normal;
                font-variant-numeric: normal;
                font-weight: 400;
                height: 36px;
                line-height: 16px;
                margin-bottom: 0px;
                margin-left: 0px;
                margin-right: 0px;
                margin-top: 0px;
                padding-bottom: 10px;
                padding-left: 0px;
                padding-right: 0px;
                padding-top: 0px;
                position: relative;
                text-size-adjust: 100%;
            }

            .input {
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.15px;
                line-height: 20px;
                background-color: var(--text-input-background-color, white);
                color: rgb(35, 39, 41);
                display: block;
                font-family: inherit;
                height: 36px;
                width: 100%;
                padding: 0px 12px;
                border-color: rgb(172, 181, 185);
                border-radius: 4px;
                border-style: solid;
                border-width: 1px;
                border-top: none;
                border-left: none;
                border-right: none;
                border-radius: 0px;
            }

            .prefix {
                display: inline-flex;
                -webkit-box-align: center;
                align-items: center;
                height: 100%;
                position: absolute;
                left: 12px;
                top: 0px;
                color: rgb(106, 118, 124);
                font-family: inherit;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.15px;
                line-height: 20px;
            }

            .suffix {
                display: inline-flex;
                -webkit-box-align: center;
                align-items: center;
                height: 100%;
                position: absolute;
                right: 12px;
                top: 0px;
                color: rgb(106, 118, 124);
                font-family: inherit;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.15px;
                line-height: 20px;
            }

            .meta {
                position: relative;
                left: 100px;
                color: var(--lumo-secondary-text-color);
                font-weight: 500;
                font-size: var(--lumo-font-size-micro);
                width: 40%;
                top: 10px;
            }

            .meta-success {
                color: var(--lumo-success-color);
            }

            .meta-error {
                color: var(--lumo-error-color);
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

            .input-label {
                align-self: flex-start;
                color: var(--lumo-secondary-text-color);
                font-weight: 500;
                font-size: var(--lumo-font-size-micro);
                margin-left: calc(var(--lumo-border-radius-m) / 4);
                transition: color 0.2s;
                line-height: 1;
                padding-right: 1em;
                padding-bottom: 0.5em;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                position: relative;
                max-width: 100%;
                box-sizing: border-box;
                top: -60px;
            }

            ::placeholder {
                color: var(--lumo-contrast-50pct);
            }

            ::-ms-input-placeholder {
                color: var(--lumo-contrast-50pct);
            }

            /* Theming */

            .no-border {
                border: none;
                caret-color: var(--lumo-primary-color);
            }

            .big {
                font-size: 20px;
                padding: 12px 18px;
                font-weight: bolder;
            }

            input.no-focus-border:focus {
                outline: none;
            }

            /* End of Theming */
        `,
    ];

    firstUpdated() {
        if (this.startFocused) {
            if (this._input != undefined) {
                this._input.focus({
                    preventScroll: true,
                });
            }
        }
        if (this._input != undefined) {
            this._input.value = this.value;
        }
    }

    update(changedProperties: PropertyValues) {
        if (this._input != undefined) {
            this._input.value = this.value;
        }

        super.update(changedProperties);
    }

    // -- Public function -- //

    // -- Handle functions -- //
    private handleOnChange(e: Event) {
        console.log("handleOnChange");
        var event = new CustomEvent("on-change", { detail: { value: e.srcElement.value } });
        this.dispatchEvent(event);
    }

    // -- Main Render -- //
    render() {
        const classes = {
            input: true,
            disabled: this.disabled,
            error: this.error,
            "no-border": this.theme.includes("no-border"),
            big: this.theme.includes("big"),
            "no-focus-border": this.theme.includes("no-focus-border"),
        };
        const styles = { "background-color": this.backgroundColor, "padding-left": "49px" };

        console.log("render text input", this.value, this._input);

        return html`
            <div class="wrapper">
                ${this.meta
                    ? html`
                          <vaadin-horizontal-layout style="width:100%;">
                              <span>
                                  <div class="numberInput">
                                      <div>
                                          <input
                                              id="input"
                                              name="target"
                                              type="text"
                                              placeholder=${this.placeholder}
                                              class="${classMap(classes)}"
                                              style=${styleMap(styles)}
                                              ?disabled=${this.disabled}
                                              ?error=${this.error}
                                              @keyup=${this.handleOnChange}
                                          />

                                          <span class="prefix">${this.prefix}</span>
                                          <span class="suffix">${this.suffix}</span>
                                      </div>
                                      <label class="input-label" for="target">${this.label}</label>
                                  </div>
                              </span>
                              <div class="meta ${this.metaClass}">${this.meta}</div>
                          </vaadin-horizontal-layout>
                      `
                    : html` <span style="width: 90%;">
                          <div class="numberInput">
                              <div>
                                  <input
                                      id="input"
                                      name="target"
                                      type="text"
                                      placeholder=${this.placeholder}
                                      class="${classMap(classes)}"
                                      style=${styleMap(styles)}
                                      ?disabled=${this.disabled}
                                      ?error=${this.error}
                                      @keyup=${this.handleOnChange}
                                      maxlength="250"
                                  />

                                  <span class="prefix">${this.prefix}</span>
                                  <span class="suffix">${this.suffix}</span>
                              </div>
                              <label class="input-label" for="target">${this.label}</label>
                          </div>
                      </span>`}
            </div>
        `;
    }
}

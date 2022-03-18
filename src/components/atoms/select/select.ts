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

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

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
@customElement("select-input")
class NumberInputElement extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    items: [Object];

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
                background-color: white;
                border-color: rgb(172, 181, 185);
                border-radius: 4px;
                border-style: solid;
                border-width: 1px;
                color: rgb(35, 39, 41);
                display: block;
                font-family: inherit;
                height: 36px;
                width: 100%;
                padding: 0px 12px;
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

            //
            //
            //
            //
            //

            .md-select {
                *,
                :after,
                :before {
                    box-sizing: border-box;
                }
                /*Demo css do not add to your project*/

                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                /*--*/

                display: block;
                margin: 10px 0 8px 0;
                padding-bottom: 2px;
                /*  position: relative;*/
                min-width: 180px;

                &.active ul {
                    max-height: 200px;
                    overflow: auto;
                    padding: 8px 0 16px 0px;
                    z-index: 2;
                    transition: all 0.2s ease;
                }
            }

            button[type="button"] {
                background: #fff;
                border-color: rgba(0, 0, 0, 0.12);
                border-width: 0 0 1px 0;
                color: rgba(0, 0, 0, 0.73);
                cursor: default;
                display: block;
                line-height: 48px;
                padding: 2px 0 1px 16px;
                position: relative;
                text-align: left;
                text-shadow: none;
                width: 100%;
                z-index: 1;
                outline: none;
                overflow: hidden;
            }

            [type="button"]:focus,
            [type="button"]:hover {
                background: rgba(0, 0, 0, 0.1);
            }
            [type="button"]:after {
                content: "\25be";
                float: right;
                padding-right: 16px;
            }

            ul[role="listbox"] {
                background-color: white;
                cursor: default;
                list-style: none;
                line-height: 26px;
                overflow: hidden;
                margin: 0;
                max-height: 0;
                position: absolute;
                padding: 0;
                transform: translateY(-50%);
                transition: all 0.15s cubic-bezier(0.35, 0, 0.25, 1);
                width: 100%;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24) !important;
            }

            ul[role="listbox"] li {
                height: 48px;
                margin: 0;
                padding: 10px 16px;
                outline: none;
                overflow: hidden;

                &:focus,
                &:hover,
                &.active {
                    background: rgba(0, 0, 0, 0.1);
                }
            }
        `,
    ];

    // -- Handle functions -- //
    private handleOnChange(e: Event) {
        console.log("handleOnChange");
        var event = new CustomEvent("on-change", { detail: { value: e.srcElement.value } });
        this.dispatchEvent(event);
    }

    // -- Main Render -- //
    render() {
        const classes = { input: true, disabled: this.disabled, error: this.error };

        return html`
            <vaadin-horizontal-layout style="width:100%;">
                <span>
                    <div class="numberInput">
                        <div>
                            <!-- <input
                                name="target"
                                type="number"
                                placeholder=${this.placeholder}
                                class="${classMap(classes)}"
                                value="${this.value}"
                                style="padding-left: 49px; padding-right: 32px;"
                                ?disabled=${this.disabled}
                                ?error=${this.error}
                                @keyup=${this.handleOnChange}
                            /> -->
                            <div class="md-select">
                                <label for="ul-id"><button type="button" class="ng-binding">State 2</button></label>
                                <ul role="listbox" id="ul-id" class="md-whiteframe-z1" aria-activedescendant="state2_AK" name="ul-id">
                                    <li role="option" id="state2_AK" class="ng-binding ng-scope active" tabindex="-1" aria-selected="true">Alaska</li>
                                    <li role="option" id="state2_AL" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Alabama</li>
                                    <li role="option" id="state2_AR" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Arkansas</li>
                                    <li role="option" id="state2_AS" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">American Samoa</li>
                                    <li role="option" id="state2_AZ" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Arizona</li>
                                    <li role="option" id="state2_CA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">California</li>
                                    <li role="option" id="state2_CO" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Colorado</li>
                                    <li role="option" id="state2_CT" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Connecticut</li>
                                    <li role="option" id="state2_DC" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">District Of Columbia</li>
                                    <li role="option" id="state2_DE" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Delaware</li>
                                    <li role="option" id="state2_FL" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Florida</li>
                                    <li role="option" id="state2_FM" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Federated States Of Micronesia</li>
                                    <li role="option" id="state2_GA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Georgia</li>
                                    <li role="option" id="state2_GU" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Guam</li>
                                    <li role="option" id="state2_HI" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Hawaii</li>
                                    <li role="option" id="state2_IA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Iowa</li>
                                    <li role="option" id="state2_ID" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Idaho</li>
                                    <li role="option" id="state2_IL" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Illinois</li>
                                    <li role="option" id="state2_IN" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Indiana</li>
                                    <li role="option" id="state2_KS" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Kansas</li>
                                    <li role="option" id="state2_KY" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Kentucky</li>
                                    <li role="option" id="state2_LA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Louisiana</li>
                                    <li role="option" id="state2_MA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Massachusetts</li>
                                    <li role="option" id="state2_MD" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Maryland</li>
                                    <li role="option" id="state2_ME" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Maine</li>
                                    <li role="option" id="state2_MH" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Marshall Islands</li>
                                    <li role="option" id="state2_MI" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Michigan</li>
                                    <li role="option" id="state2_MN" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Minnesota</li>
                                    <li role="option" id="state2_MO" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Missouri</li>
                                    <li role="option" id="state2_MP" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Northern Mariana Islands</li>
                                    <li role="option" id="state2_MS" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Mississippi</li>
                                    <li role="option" id="state2_MT" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Montana</li>
                                    <li role="option" id="state2_NC" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">North Carolina</li>
                                    <li role="option" id="state2_ND" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">North Dakota</li>
                                    <li role="option" id="state2_NE" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Nebraska</li>
                                    <li role="option" id="state2_NH" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">New Hampshire</li>
                                    <li role="option" id="state2_NJ" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">New Jersey</li>
                                    <li role="option" id="state2_NM" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">New Mexico</li>
                                    <li role="option" id="state2_NV" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Nevada</li>
                                    <li role="option" id="state2_NY" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">New York</li>
                                    <li role="option" id="state2_OH" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Ohio</li>
                                    <li role="option" id="state2_OK" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Oklahoma</li>
                                    <li role="option" id="state2_OR" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Oregon</li>
                                    <li role="option" id="state2_PA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Pennsylvania</li>
                                    <li role="option" id="state2_PR" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Puerto Rico</li>
                                    <li role="option" id="state2_PW" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Palau</li>
                                    <li role="option" id="state2_RI" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Rhode Island</li>
                                    <li role="option" id="state2_SC" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">South Carolina</li>
                                    <li role="option" id="state2_SD" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">South Dakota</li>
                                    <li role="option" id="state2_TN" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Tennessee</li>
                                    <li role="option" id="state2_TX" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Texas</li>
                                    <li role="option" id="state2_UT" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Utah</li>
                                    <li role="option" id="state2_VA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Virginia</li>
                                    <li role="option" id="state2_VI" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Virgin Islands</li>
                                    <li role="option" id="state2_VT" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Vermont</li>
                                    <li role="option" id="state2_WA" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Washington</li>
                                    <li role="option" id="state2_WI" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Wisconsin</li>
                                    <li role="option" id="state2_WV" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">West Virginia</li>
                                    <li role="option" id="state2_WY" class="ng-binding ng-scope" tabindex="-1" aria-selected="false">Wyoming</li>
                                </ul>
                            </div>

                            <!-- 
                            <span class="prefix">${this.prefix}</span>
                            <span class="suffix">${this.suffix}</span> -->
                        </div>
                        <label class="input-label" for="target">${this.label}</label>
                    </div>
                </span>
                ${this.meta ? html`<div class="meta ${this.metaClass}">${this.meta}</div>` : html``}
            </vaadin-horizontal-layout>
        `;
    }
}

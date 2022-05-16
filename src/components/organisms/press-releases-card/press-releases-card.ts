import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import { format } from "date-fns";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../../atoms/card/card";

@customElement("press-releases-card")
export class PressReleasesCard extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Object })
    stock?: object;

    // @property({ type: Boolean, reflect: false })
    // open: boolean = false;

    // @query(".wrapper")
    // _wrapper: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            #body-card {
                padding: 24px;
                padding-top: 0px;
            }

            #logo {
                border-radius: 0;
                padding: 0.3rem;
                width: 50px;
                height: 50px;
            }

            #stockCompanyName {
                padding: 10px;
                padding-top: 24px;
                padding-bottom: 0px;
            }

            #stockExchange {
                padding: 10px;
                padding-top: 0px;
            }

            .info-box {
                overflow: hidden;
            }

            .info-box .info {
                box-sizing: border-box;
                float: left;
                width: 33.3333333333%;
                padding: 0;
                min-height: 50px;
            }
            .info {
                clear: none;
            }

            .info-box .info-col-2 {
                box-sizing: border-box;
                float: left;
                width: 50%;
                padding: 0;
                min-height: 50px;
            }

            .info-box .info h4,
            .info-box .info-col-2 h4,
            h4 {
                font-size: 11px;
                line-height: 11px;
                margin-bottom: 9px;
                color: rgba(0, 0, 0, 0.5);
                margin-top: 33px;
                text-transform: none;
                font-weight: 400;
                font-family: monospace;
            }

            .info-a {
                font-size: var(--lumo-font-size-tiny);
                color: var(--lumo-primary-text-color);
                text-decoration: none;
            }

            span.accent {
                font-family: monospace;
                display: inline-block;
                width: 8%;
                color: rgba(0, 0, 0, 0.5);
                font-size: 11px;
            }

            address {
                text-decoration: none;
            }

            address span {
                display: block;
            }

            a[href^="tel"] {
                border: 1px solid #ccc;
                border-radius: 5px;
                color: black;
                display: inline-block;
                font-style: normal;
                margin-top: 10px;
                padding: 3px 5px;
                text-decoration: none;
            }

            a[href^="tel"]:before {
                content: "tel: ";
                font-weight: bold;
            }

            .pr-row {
                min-height: 50px;
            }

            .pr-date {
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-xxs);
                font-family: monospace;
            }
            .pr-title {
                text-transform: capitalize;
                padding-top: 8px;
                padding-bottom: 0px;
                font-weight: 500;
                text-align: left;
                text-decoration: none;
            }

            .pr-title a {
                text-transform: capitalize;
                padding-top: 8px;
                padding-bottom: 0px;
                color: var(--lumo-primary-text-color);
                font-weight: 500;
                text-align: left;
                text-decoration: none;
            }

            .pr-title a:hover {
                text-decoration: none;
            }

            .pr-title a:visited {
                text-decoration: none;
            }

            .pr-text {
                text-transform: capitalize;
                text-align: left;
                font-family: monospace;
            }

            .truncate {
                display: -webkit-box;
                max-width: 100%;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        `,
    ];

    // -- Lifecycle function -- //

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        // Inspired by https://freefrontend.com/css-cards/
        return html`
            <y-card noFooter height="400" title="${this.stock?.symbol} Press Releases">
                <div slot="header">
                    <span style="margin-left: auto;">
                        <vaadin-button id="help" class="help" @click=${this.handleToggleHelp} theme="icon" aria-label="Show help"
                            ><vaadin-icon icon="vaadin:question-circle-o"></vaadin-icon>
                        </vaadin-button>
                    </span>
                </div>

                <div id="body-card" slot="body">
                    <div class="info-box">
                        <vaadin-horizontal-layout>
                            <span>
                                <vaadin-avatar id="logo" img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: var(--lumo-size-s);"></vaadin-avatar>
                            </span>
                        </vaadin-horizontal-layout>
                    </div>

                    <div class="info-box">
                        <div class="info-col-1">
                            <h4>Press Releases</h4>
                            <table>
                                <thead></thead>
                                <tbody>
                                    ${this.stock?.press_releases.map((pr, index) => {
                                        return html`
                                            <tr role="row" index="${index}">
                                                <td class="pr-date" style="width: 18%;">${format(new Date(pr.date), "dd MMM yyyy")}</td>
                                                <td style="width: 82%;">
                                                    <vaadin-vertical-layout theme="spacing">
                                                        <span class="pr-title">${pr?.url ? html`<a href="${pr?.url}">${pr.title.toLowerCase()}</a>` : html`${pr.title.toLowerCase()}`}</span>
                                                        <span class="pr-text truncate">${pr.text.toLowerCase()}</span>
                                                    </vaadin-vertical-layout>
                                                </td>
                                            </tr>
                                        `;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </y-card>
        `;
    }
}

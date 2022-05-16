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

const ACCENTED_TYPES = ["10-K", "10-Q"];

@customElement("sec-filings-card")
export class SECFilingsCard extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Object })
    stock?: object;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            #body-card {
                padding: 16px;
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
                padding-top: 8px;
                padding-bottom: 0px;
                font-weight: 500;
                text-align: center;
                text-decoration: none;
                font-family: monospace;
            }

            .pr-title a {
                padding-top: 8px;
                padding-bottom: 0px;
                color: var(--lumo-contrast);
                font-weight: 500;
                text-align: center;
                text-decoration: none;
            }

            .pr-title a:hover {
                text-decoration: none;
            }

            .pr-title a:visited {
                text-decoration: none;
            }

            .pr-accent-title,
            .pr-accent-title a {
                font-size: var(--lumo-font-size-m);
                color: var(--lumo-primary-text-color);
            }

            .pr-text {
                text-transform: capitalize;
                text-align: center;
                font-family: monospace;
            }

            .truncate {
                display: -webkit-box;
                max-width: 100%;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            tr[role="row"]:hover {
                background-color: var(--lumo-shade-5pct);
                cursor: pointer;
            }

            .secType {
                margin-top: 8px;
                padding-left: 8px;
                margin-left: auto;
                margin-right: auto;
                font-weight: 500;
                font-size: large;
            }

            #filterButton {
                background-color: var(--lumo-shade-40pct);
                font-family: monospace;
                font-size: var(--lumo-font-size-xxs);
            }
        `,
    ];

    // -- Lifecycle function -- //

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        // Inspired by https://freefrontend.com/css-cards/
        return html`
            <y-card noFooter width="700" height="400" title="${this.stock?.symbol} SEC Filings">
                <div slot="header">
                    <span style="margin-left: auto;">
                        <vaadin-button id="help" class="help" @click=${this.handleToggleHelp} theme="icon" aria-label="Show help"
                            ><vaadin-icon icon="vaadin:question-circle-o"></vaadin-icon>
                        </vaadin-button>
                    </span>
                </div>

                <div id="body-card" slot="body">
                    <div class="info-box">
                        <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                            <span>
                                <vaadin-avatar id="logo" img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: var(--lumo-size-s);"></vaadin-avatar>
                            </span>
                            <span style="margin-left:auto;">
                                <select name="target">
                                    <option value="oneday">10-K</option>
                                    <option value="threedays">10-Q</option>
                                </select>
                            </span>
                            <span style="margin-right:auto;">
                                <vaadin-button id="filterButton" theme="primary " aria-label="Filter"> Filter </vaadin-button>
                            </span>
                        </vaadin-horizontal-layout>
                    </div>

                    <div class="info-box">
                        <div class="info-col-1">
                            <h4>SEC Filings</h4>
                            <table>
                                <thead></thead>
                                <tbody>
                                    ${this.stock?.sec_filings.map((filing, index) => {
                                        return html`
                                            <tr
                                                role="row"
                                                @click="${() => {
                                                    window.location = filing.link;
                                                }}"
                                            >
                                                <td class="pr-date" style="width: 10%;">
                                                    <vaadin-vertical-layout>
                                                        <span style="padding-left:8px;">${format(new Date(filing.filling_date), "dd MMM yyyy")}</span>
                                                        <span class="secType">${filing.type}</span>
                                                    </vaadin-vertical-layout>
                                                </td>
                                                <td style="width: 90%;">
                                                    <span class="pr-title ${ACCENTED_TYPES.includes(filing?.type) ? "pr-accent-title" : ""}">
                                                        ${filing?.link ? html`<a href="${filing?.link}">${filing?.text}</a>` : html`${filing?.text}`}
                                                    </span>
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

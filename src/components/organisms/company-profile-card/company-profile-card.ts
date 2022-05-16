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

@customElement("company-profile-card")
export class CompanyProfileCard extends LitElement {
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
                width: 100px;
                height: 100px;
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
        `,
    ];

    // -- Lifecycle function -- //

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        // Inspired by https://freefrontend.com/css-cards/
        return html`
            <y-card noFooter width="700" title="Company Profile">
                <div id="body-card" slot="body">
                    <div class="info-box">
                        <vaadin-horizontal-layout>
                            <span>
                                <vaadin-avatar id="logo" img="${this.stock?.logo_url}" name="${this.stock?.symbol}" style="--vaadin-avatar-size: var(--lumo-size-s);"></vaadin-avatar>
                            </span>
                            <span>
                                <vaadin-vertical-layout>
                                    <span id="stockCompanyName" class="stockSymbolBig">${this.stock?.company_name}</span>
                                    <span id="stockExchange" class="description" style="font-size: var(--lumo-font-size-xxs)">${this.stock?.exchange_short_name} &gt; ${this.stock?.symbol}</span>
                                </vaadin-vertical-layout>
                            </span>

                            <span style="margin-left: auto;">
                                <h4>Market Cap</h4>
                                ${this.stock?.market_cap_numerize}
                            </span>

                            ${this.stock?.dividend_yield_ttm_percentage
                                ? html`
                                      <span style="margin-left: auto;">
                                          <h4>Dividend</h4>
                                          ${this.stock?.dividend_yield_ttm_percentage}%
                                      </span>
                                  `
                                : html``}
                            ${this.stock?.shares_outstanding_numerize
                                ? html`
                                      <span style="margin-left: auto;">
                                          <h4>Shares</h4>
                                          ${this.stock?.shares_outstanding_numerize}
                                      </span>
                                  `
                                : html``}
                        </vaadin-horizontal-layout>
                    </div>

                    <div class="info-box">
                        <div class="info">
                            <h4>IPO</h4>
                            ${format(new Date(this.stock?.ipo_date), "dd MMM yyyy")}
                        </div>
                        <div class="info">
                            <h4>Next Earnings Announcement</h4>
                            ${format(new Date(this.stock?.earnings_announcement), "dd MMM yyyy")}
                        </div>
                    </div>

                    <div class="info-box">
                        <div class="info">
                            <h4>Country</h4>
                            ${this.stock?.country}
                        </div>
                        <div class="info">
                            <h4>Sector</h4>
                            ${this.stock?.sector}
                        </div>
                        <div class="info">
                            <h4>Industry</h4>
                            ${this.stock?.industry}
                        </div>
                    </div>

                    <div class="info-box">
                        <div class="info">
                            <h4>Address</h4>
                            <address>
                                <span>${this.stock?.company_name}</span>
                                <span>${this.stock?.city}</span>
                                <span>${this.stock?.state}</span>
                                <span><a href="tel:${this.stock?.phone}">${this.stock?.phone}</a></span>
                            </address>
                        </div>
                        <div class="info">
                            <h4>Website</h4>
                            <a class="info-a" href="${this.stock?.website}" target="_blank">${this.stock?.website}</a>
                        </div>
                        <div class="info">
                            <h4>Investor Relations</h4>
                            <a class="info-a" href="${this.stock?.investor_relations}" target="_blank">${this.stock?.investor_relations}</a>
                        </div>
                    </div>

                    <div class="info-box">
                        <div class="info">
                            <h4>CEO</h4>
                            ${this.stock?.ceo}
                        </div>
                        <div class="info">
                            <h4>Number of Employees</h4>
                            ${this.stock?.full_time_employees}
                        </div>
                    </div>
                    <div class="info-box">
                        <h4>Description</h4>
                        ${this.stock?.description}
                    </div>
                    <div class="info-box">
                        <h4>Identification</h4>
                        <p><span class="accent">cik:</span>${this.stock?.cik}</p>
                    </div>
                </div>
            </y-card>
        `;
    }
}

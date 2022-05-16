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

@customElement("company-investor-relations-card")
export class CompanyInvestorRelationsCard extends LitElement {
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

            .info-box .info-col-1 {
                box-sizing: border-box;
                float: left;
                width: 80%;
                padding: 0;
                min-height: 50px;
            }

            .info-box .info-col-2 {
                box-sizing: border-box;
                float: left;
                width: 50%;
                padding: 0;
                min-height: 50px;
            }

            .info-box .info h4,
            .info-box .info-col-1 h4,
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
                font-size: var(--lumo-font-size-s);
                color: var(--lumo-primary-text-color);
                text-decoration: none;
            }

            span.accent {
                font-family: monospace;
                display: inline-block;
                width: 16%;
                color: rgba(0, 0, 0, 0.5);
                font-size: 11px;
            }
        `,
    ];

    // -- Lifecycle function -- //

    // -- Other Renders -- //
    renderBool(val: boolean) {
        if (val === null || val === undefined) {
            return "-";
        }

        return val ? "Yes" : "No";
    }

    // -- Main Render -- //
    render() {
        // Inspired by https://freefrontend.com/css-cards/
        return html`
            <y-card noFooter width="450" height="400" title="${this.stock?.symbol} Investor Relations">
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
                            <h4>Investor Relations URL</h4>
                            <a class="info-a" href="${this.stock?.investor_relations}" target="_blank">${this.stock?.investor_relations}</a>
                        </div>
                    </div>
                </div>
            </y-card>
        `;
    }
}

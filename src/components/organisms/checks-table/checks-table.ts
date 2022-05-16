import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/button";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../../atoms/pass-fail/pass-fail";

@customElement("checks-table")
export class ChecksTable extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: String })
    symbol: string = "";

    // @property({ type: Boolean, reflect: false })
    // open: boolean = false;

    // @query(".wrapper")
    // _wrapper: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        // badge,
        // utility,
        // spacing,
        themeStyles,
        css`
            table.yld0 {
                margin-top: 10px;
            }

            .header {
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-m);
                padding: 12px;
            }

            .checkTopic {
                color: var(--lumo-disabled-text-color);
                font-size: var(--lumo-font-size-xs);
                font-weight: 500;
                text-align: center;
            }

            .checkQuestion {
                color: var(--lumo-contrast-color);
                font-size: var(--lumo-font-size-xs);
                font-weight: 500;
                text-align: left;
                padding: 12px;
                padding-top: 2px;
                padding-left: 16px;
                padding-bottom: 2px;
            }

            .checkMeta {
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
                padding-top: 2px;
                padding-left: 16px;
                padding-right: 8px;
                padding-bottom: 8px;
                text-align: left;
            }
        `,
    ];

    // -- Lifecycle function -- //

    // -- Basic functions -- //
    handleFinancialChecksRow(items: [Object]) {
        const rows = [];
        items.map((row, index) => {
            rows.push(html`
                <tr role="row" index="${index}" style="background-color: white;">
                    <td style="width: 15%;">
                        <span class="checkTopic">${row.topic}</span>
                    </td>
                    <td style="width: 65;">
                        <vaadin-horizontal-layout style="align-this.items: center;" theme="spacing">
                            <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                <span class="checkQuestion">${row.check}</span>
                                <span class="checkMeta">${row.meta}</span>
                            </vaadin-vertical-layout>
                        </vaadin-horizontal-layout>
                    </td>
                    <td style="width: 20%;">
                        <div style="margin-left: auto; margin-right: auto;">
                            <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);"><pass-fail ?pass="${row.pass}"></pass-fail></vaadin-vertical-layout>
                        </div>
                    </td>
                </tr>
            `);
        });
        return html` ${rows.map((i) => html`${i}`)} `;
    }

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        const checks = [
            {
                check: "Is the last 4 quarters debt to equity ratio (D/E) less than the debt to equity ratio 5 years ago?",
                topic: "Interest Coverage",
                meta: "IO's debt relative to shareholder equity (0.9) has decreased or remained constant compared to 5 years ago",
                pass: false,
            },
            {
                check: "Are they forecast to achieve profitability?",
                topic: "Risk",
                meta: "The company is currently profitable",
                pass: true,
            },
        ];

        return html`
            <table class="yld0">
                <thead>
                    <tr>
                        <th colspan="2"><div class="header">${this.symbol} Financial Checks</div></th>
                    </tr>
                </thead>

                <tbody>
                    ${this.handleFinancialChecksRow(checks)}
                </tbody>
            </table>
        `;
    }
}

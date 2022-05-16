import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../../atoms/container/container";
import "../../atoms/card/card";
import "../../atoms/rating-slider/rating-slider";
import "../../atoms/table-simple/table-simple";
import "../../atoms/flag/flag";

@customElement("financial-health-card")
export class FinancialHealthCard extends LitElement {
    // -- Start of state, properties, queries -- //

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
            #topicsTable {
                width: 40%;
            }
        `,
    ];

    // -- Lifecycle function -- //

    // -- Other Renders -- //

    customStyles() {
        return html`
            <style>
                .box2 {
                    --grade-fill-color: grey;

                    padding-bottom: 8px;
                    position: relative;

                    border: 1px solid;
                    /* A CSS variable that is defined in the Lumo theme. */
                    /* border-color: var(--lumo-contrast-10pct); */
                    display: flex;
                    flex-direction: column;
                    border-radius: 4px;
                    /* border: 1px solid var(--grade-fill-color); */
                    border: 1px solid rgba(0, 0, 0, 0.07);
                    /* background: var(--grade-fill-color); */
                    /* background-color: #f7f8fa; */
                    padding: 10px;
                }

                .box2 .text {
                    font-family: Garnett, sans-serif;
                    font-weight: 500;
                    position: absolute;
                    transform: translate(-50%, -50%);
                    top: 50%;
                    left: 50%;
                    color: var(--lumo-contrast);
                    font-size: var(--lumo-font-size-xs);
                }
                .circle {
                    display: inline-block;
                    background: var(--grade-fill-color);
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    vertical-align: middle;
                    margin: auto;
                }

                .separator {
                    margin-top: 40px;
                    margin-bottom: 40px;
                    -webkit-align-self: stretch;
                    -ms-flex-item-align: stretch;
                    -ms-grid-row-align: stretch;
                    align-self: stretch;
                    border-bottom: 1px solid #98999a;
                }
            </style>
        `;
    }

    // -- Main Render -- //
    render() {
        const items = [
            { name: "Altman Z-Score", current: 3 },
            { name: "Piotroski Score", current: 3 },
        ];

        const items_topic = [
            { name: "Profit Growth", score: 1 },
            { name: "Debt to Equity", score: 2 },
            { name: "Profit Growth", score: 3 },
            { name: "Debt to Equity1", score: 4 },
            { name: "Debt to Equity2", score: 5 },
        ];

        const headerCells_topic = [
            {
                id: "name",
                label: "Name",
                width_percentage: "60",
                template: (row: Object) => {
                    return html`
                        <style>
                            .box2 {
                                --grade-fill-color: grey;

                                padding-bottom: 8px;
                                position: relative;

                                border: 1px solid;
                                /* A CSS variable that is defined in the Lumo theme. */
                                /* border-color: var(--lumo-contrast-10pct); */
                                display: flex;
                                flex-direction: column;
                                border-radius: 4px;
                                /* border: 1px solid var(--grade-fill-color); */
                                border: 1px solid rgba(0, 0, 0, 0.07);
                                /* background: var(--grade-fill-color); */
                                /* background-color: #f7f8fa; */
                                padding: 10px;
                            }

                            .box2 .text {
                                font-family: Garnett, sans-serif;
                                font-weight: 500;
                                position: absolute;
                                transform: translate(-50%, -50%);
                                top: 50%;
                                left: 50%;
                                color: var(--lumo-contrast);
                                font-size: var(--lumo-font-size-xs);
                            }
                            .circle {
                                display: inline-block;
                                background: var(--grade-fill-color);
                                height: 14px;
                                width: 14px;
                                border-radius: 50%;
                                vertical-align: middle;
                                margin: auto;
                            }

                            .separator {
                                margin-top: 10px;
                                margin-bottom: 10px;
                                -webkit-align-self: stretch;
                                -ms-flex-item-align: stretch;
                                -ms-grid-row-align: stretch;
                                align-self: stretch;
                                border-bottom: 1px solid #98999a;
                            }
                        </style>
                        <div class="box2">
                            <!-- <span class="circle"></span> -->
                            <!-- <metric-slider min="0" value="40" max="100"></metric-slider> -->
                            <vaadin-vertical-layout>
                                <span class="text">${row.name}</span>
                                <span class="separator"></span>
                                <!-- <span>GOOD</span> -->
                            </vaadin-vertical-layout>
                        </div>
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
            {
                id: "score",
                label: "",
                width_percentage: "40",
                template: (row: Object) => {
                    console.log("redknapp", row?.score, row);
                    return html`
                        <!-- <rating-slider min="0" value="40" max="100"></rating-slider> -->
                        <!--<flag-box score="${row?.score}" value=${row.score}></flag-box> -->
                    `;
                },
                template_args: {
                    row: null, // special case: Applies row data as argument
                },
            },
        ];

        const headerCells = [
            {
                id: "name",
                label: "Name",
                width_percentage: "30",
            },
            {
                id: "current",
                label: "Current",
                width_percentage: "10",
            },
            {
                id: "extra",
                label: "extra",
                width_percentage: "10",
            },
        ];

        return html`
            <br />
            <y-card width="700" height="400" title="Financial Health">
                <div slot="body">
                    <!-- <table-simple title="Dividend Calendar" .headerCells=${headerCells} .items=${items}> </table-simple> -->
                    <table-simple width="500" noHeader noRowBorder .headerCells=${headerCells_topic} .items=${items_topic}> </table-simple>
                    <table-simple noRowBorder title="Dividend Calendar" .headerCells=${headerCells} .items=${items}> </table-simple>
                </div>
            </y-card>
            <!-- <metric-slider min="0" value="40" max="100"></metric-slider>
            <y-container width="350" height="200">jslkfjksjlfjlds</y-container>
             -->
        `;
    }
}

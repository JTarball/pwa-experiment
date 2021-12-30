/* Stock Info Tab */
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/grid";
import "@vaadin/button";
import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/text-field";
import "@vaadin/vertical-layout";
import "@vaadin/text-area";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import { themeStyles } from "../../themes/yld0-theme/styles.js";

@customElement("stock-info")
class YLD0StockInfo extends LitElement {
    @property() Test = "";

    @property()
    private myChart?: Object;

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            section {
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
            }

            th,
            td {
                /* background: #eee; */
                padding: 8px;
            }

            tr {
                transition: transform 0.35s ease-out;
                /*transition: all 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55);*/
                /* transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
                transition-duration: 0.9s; */
            }

            .rubberband {
                -webkit-animation-name: rubberBand;
                animation-name: rubberBand;
            }

            .tdDeleteRow {
                position: absolute;
                right: -100px;
                display: none;
                opacity: 0;
                visibility: hidden;
                transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
            }
            .tdDeleteRow[active] {
                visibility: visible;
                display: flex;
                opacity: 1;
            }

            button:hover {
                animation-name: rubberBand;
            }

            @keyframes rubberBand {
                from {
                    transform: scale3d(1, 1, 1);
                }

                30% {
                    transform: scale3d(1.25, 0.75, 1);
                }

                40% {
                    transform: scale3d(0.75, 1.25, 1);
                }

                50% {
                    transform: scale3d(1.15, 0.85, 1);
                }

                65% {
                    transform: scale3d(0.95, 1.05, 1);
                }

                75% {
                    transform: scale3d(1.05, 0.95, 1);
                }

                to {
                    transform: scale3d(1, 1, 1);
                }
            }

            @media screen and (max-width: 400px) {
                table {
                    width: 100%;
                }

                table thead {
                    display: none;
                }

                table tr,
                table td {
                    border-bottom: 1px solid #ddd;
                }

                table tr {
                    margin-bottom: 8px;
                }

                table td {
                    display: flex;
                }

                table td::before {
                    content: attr(label);
                    font-weight: bold;
                    /*width: 120px;
                    min-width: 120px;*/
                }
            }
        `,
    ];

    async firstUpdated() {
        const ctx = this.renderRoot.querySelector("#myChart2").getContext("2d");

        this.myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "# of Votes",
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: ["rgba(255,99,132,1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
                        borderWidth: 1,
                        fill: true,
                    },
                    {
                        label: "# of lemon",
                        data: [12, 12, 12, 12, 12, 12],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: ["rgba(255,99,132,1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
                        borderWidth: 1,
                        fill: true,
                    },
                ],
            },
            options: {},
        });
    }

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <p>Inside Render:</p>
                <div>
                    <canvas id="myChart2" width="400" height="400"></canvas>
                </div>
            </section>

            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

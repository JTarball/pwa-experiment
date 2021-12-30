/* Full Page Modal */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/grid";
import "@vaadin/vaadin-radio-button";
import "@vaadin/button";
import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/text-field";
import "@vaadin/vertical-layout";
import "@vaadin/text-area";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/menu-bar";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { Stock } from "../../store/models.js";

import "../page-modal.js";
import "../yld0-ellipsis.js";

@customElement("home-recent")
class YLD0HomeRecent extends LitElement {
    /* Properties, states etc. */

    @state()
    private items_recent?: Stock[];

    // End of properties ...

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            table {
                margin-top: 0px;
            }
            vaadin-list-box {
                font-weight: 200;
            }

            #addToWatch {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
            }
        `,
    ];

    async firstUpdated() {
        const items_recent: Stock[] = [
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "2.434",
                priceChangeSinceWatched: "6.00",
                priceChangeSinceWatchedPercent: "1.466",
            },
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "3.566",
                priceChangeSinceWatched: "6.34",
                priceChangeSinceWatchedPercent: "2.416",
            },
            {
                symbol: "AMD",
                companyName: "Advanced Micro Devices, Inc.",
                logoUrl: "https://logo.clearbit.com/amd.com",
                price: "$137.75",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "2.466",
                priceChangeSinceWatched: "8.12",
                priceChangeSinceWatchedPercent: "2.366",
            },
        ];
        this.items_recent = items_recent;
    }

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <table>
                    <thead>
                        <tr>
                            <th style="vertical-align: bottom;">
                                <span class="headerTitle">Recent</span>
                            </th>
                            <th></th>
                        </tr>
                        <thead></thead>
                    </thead>
                    ${this.items_recent?.map((item, index) => {
                        return html`
                            <tr role="row" index="${index}">
                                <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                                <td style="width: 65%;">
                                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                        <vaadin-avatar img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                            <span class="stockSymbol">${item.symbol} </span>
                                            <span class="companyName">${item.companyName}</span>
                                        </vaadin-vertical-layout>
                                    </vaadin-horizontal-layout>
                                </td>

                                <td style="width: 10%;">
                                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                        <vaadin-button id="addToWatch">Add to watch</vaadin-button>
                                    </vaadin-vertical-layout>
                                </td>
                            </tr>
                        `;
                    })}
                </table>
            </section>
            <br />
            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

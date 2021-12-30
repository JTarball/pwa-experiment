/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, css, render } from "lit";
import { customElement, state } from "lit/decorators.js";

import "@vaadin/vaadin-lumo-styles/utility";

import config from "../config.js";
import { PageElement } from "../helpers/page-element.js";

import "../components/top-navbar";
import "../components/bottom-navbar";

import "@vaadin/avatar";
import "@vaadin/button";
import "@vaadin/grid";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import type { GridItemModel } from "@vaadin/grid";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
//import { getPeople } from "Frontend/demo/domain/DataService";
import { Stock } from "../store/models.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@vaadin/vaadin-lumo-styles/vaadin-iconset";
import "@vaadin/icon";

@customElement("page-alerts")
export class PageAlerts extends PageElement {
    @state()
    private items?: Stock[];

    async firstUpdated() {
        //const { people } = await getPeople();
        const people: Stock[] = [
            { asset: "SONO", assetDescription: "Sonos", price: "$2345.2", status: "Available", priceChange: "2.33", noOfAlerts: 2 },
            { asset: "SPCE", assetDescription: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", noOfAlerts: 10 },
            { asset: "TSLA", assetDescription: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { asset: "MSFT", assetDescription: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", noOfAlerts: 1 },
            { asset: "SONO", assetDescription: "Sonos", price: "$2345.2", status: "Available", priceChange: "2.33", noOfAlerts: 2 },
            { asset: "SPCE", assetDescription: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", noOfAlerts: 10 },
            { asset: "TSLA", assetDescription: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { asset: "MSFT", assetDescription: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", noOfAlerts: 1 },
        ];
        this.items = people;
    }

    static styles = [
        badge,
        utility,
        themeStyles,
        css`
            /* handle the light / dark mode */
            /* :host:not([dark]) {
                 --bk-color: #eee;
             }
             :host([dark]) {
                 color: red;
             } */

            section {
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
            }

            vaadin-grid {
                border: none;
            }
            vaadin-grid-column {
                font-size: var(--lumo-font-size-xs);
            }

            vaadin-grid-cell-content {
                padding: var(--lumo-space-m);
            }

            #price {
                font-weight: 500;
            }

            #priceChange {
                font-size: 0.7em;
                margin-top: 0.5em;
            }

            #noOfAlerts {
                font-size: 0.8em;
            }
        `,
    ];

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}"></top-navbar>

            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <vaadin-grid .items="${this.items}">
                    <vaadin-grid-column @click=${this.goStockDetail} frozen width="50%" flex-grow="0" header="Asset" .renderer="${this.employeeRenderer}" flex-grow="0"></vaadin-grid-column>
                    <vaadin-grid-column .renderer="${this.statusRenderer}" auto-width></vaadin-grid-column>
                    <vaadin-grid-column .renderer="${this.noOfAlertsRenderer}" auto-width></vaadin-grid-column>
                </vaadin-grid>
            </section>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- The bottom tabs -->
            <bottom-navbar .location=${this.location}></bottom-navbar>
        `;
    }

    private goStockDetail = () => {};

    private employeeRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<Stock>) => {
        const stock = model.item;
        render(
            html`
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                    <vaadin-avatar img="${stock.pictureUrl}" name="${stock.asset}" alt="User avatar"></vaadin-avatar>
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <span> ${stock.asset}</span>
                        <span style="font-size: var(--lumo-font-size-s); color: var(--lumo-secondary-text-color);"> ${this.truncate(stock.assetDescription)} </span>
                    </vaadin-vertical-layout>
                </vaadin-horizontal-layout>
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing"> </vaadin-horizontal-layout>
            `,
            root
        );
    };

    private truncate = (str: string, length: int = 20) => {
        return str.length > length ? str.substring(0, length - 3) + "..." : str;
    };

    private statusRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<Stock>) => {
        const person = model.item;
        render(
            html`
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-s);">
                        <span id="price">${person.price}</span>
                        ${person.priceChange
                            ? html`<span id="priceChange" theme="badge ${person.priceChange > 0 ? "success" : "error"}">1d ${person.priceChange > 0 ? "+" : ""}${person.priceChange}%</span>`
                            : html``}
                    </vaadin-vertical-layout>
                </vaadin-horizontal-layout>
            `,
            root
        );
    };

    private noOfAlertsRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<Stock>) => {
        const stock = model.item;
        render(html`${stock.noOfAlerts ? html`<span id="noOfAlerts" theme="badge contrast pill">${stock.noOfAlerts}</span>` : html``} `, root);
    };

    meta() {
        return {
            title: "Alerts",
            titleTemplate: "List of alerts",
            description: config.appDescription,
        };
    }
}

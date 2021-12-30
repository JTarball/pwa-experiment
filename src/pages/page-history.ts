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

import "../components/timeline-list";
import "../components/top-navbar";
import "../components/bottom-navbar";
import "../components/history";

import "@vaadin/avatar";
import "@vaadin/button";
import "@vaadin/grid";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import type { GridItemModel } from "@vaadin/grid";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
//import { getPeople } from "Frontend/demo/domain/DataService";
import { TimeLine } from "../store/models.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@vaadin/vaadin-lumo-styles/vaadin-iconset";
import "@vaadin/icon";

@customElement("page-history")
export class PageHistory extends PageElement {
    @state()
    private items?: TimeLine[];

    async firstUpdated() {
        //const { people } = await getPeople();
        const people: TimeLine[] = [
            { title: "Price Change", description: "Price Changes", price: "$2345.2", status: "Available", priceChange: "2.33", mood: true, timeAgo: "Yesterday" },
            {
                title: "SPCE",
                description: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah dsh jshfj hdjsfjhsd fkjsdhjf jdhjdhwugf eubeuebe eh h ghe hebev egge",
                price: "$15.24",
                priceChange: "-13",
                mood: true,
            },
            { title: "TSLA", description: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { title: "MSFT", description: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", mood: false },
            { title: "Price Change", description: "Price Changes", price: "$2345.2", status: "Available", priceChange: "2.33", mood: false },
            { title: "SPCE", description: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", mood: false },
            { title: "TSLA", description: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { title: "MSFT", description: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", mood: false },
            { title: "Price Change", description: "Price Changes", price: "$2345.2", status: "Available", priceChange: "2.33", mood: true, timeAgo: "Yesterday" },
            {
                title: "SPCE",
                description:
                    "Virgin Galactic Holdings Inc, Blah Blah Blah Blah jkashdk ajdhak hdkj aksjhdkjsakjdhkjsahjkdhsakhdjks hadjkshad jsahd s ja jdhs hs shshs shsh theb jadsb sgvfjhfb shsbsgf b",
                price: "$15.24",
                priceChange: "-13",
                mood: true,
            },
            { title: "TSLA", description: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { title: "MSFT", description: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", mood: false },
            { title: "Price Change", description: "Price Changes", price: "$2345.2", status: "Available", priceChange: "2.33", mood: false },
            { title: "SPCE", description: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", mood: false },
            { title: "TSLA", description: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { title: "MSFT", description: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", mood: false },
            { title: "Price Change", description: "Price Changes", price: "$2345.2", status: "Available", priceChange: "2.33", mood: true, timeAgo: "Yesterday" },
            { title: "SPCE", description: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", mood: true },
            { title: "TSLA", description: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { title: "MSFT", description: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", mood: false },
            { title: "Price Change", description: "Price Changes", price: "$2345.2", status: "Available", priceChange: "2.33", mood: false },
            { title: "SPCE", description: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", mood: false },
            { title: "TSLA", description: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { title: "MSFT", description: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", mood: false },
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
                padding: 1rem;
                /* background: var(--lumo-base-color); */
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
                background: #ecf8fa;s
            }
        `,
    ];

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}"></top-navbar>

            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <history-home></history-home>

                <!-- <timeline-list .items=${this.items}></timeline-list> -->
                <!-- <vaadin-grid .items="${this.items}">
                    <vaadin-grid-column auto-width flex-grow="0" header="title" .renderer="${this.employeeRenderer}" flex-grow="0"></vaadin-grid-column>
                    <vaadin-grid-column .renderer="${this.moodRenderer}" auto-width></vaadin-grid-column>
                </vaadin-grid>
                <vaadin-grid .items="${this.items}">
                    <vaadin-grid-column auto-width flex-grow="0" header="title" .renderer="${this.employeeRenderer}" flex-grow="0"></vaadin-grid-column>
                    <vaadin-grid-column .renderer="${this.moodRenderer}" auto-width></vaadin-grid-column>
                </vaadin-grid> -->
            </section>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- The bottom tabs -->
            <bottom-navbar .location=${this.location}></bottom-navbar>
        `;
    }

    private employeeRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<TimeLine>) => {
        const stock = model.item;
        render(
            html`
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                    <vaadin-avatar img="${stock.pictureUrl}" name="${stock.title}" alt="User avatar"></vaadin-avatar>
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <span> ${stock.title}</span>
                        <div id="description">${stock.description}</div>
                    </vaadin-vertical-layout>
                </vaadin-horizontal-layout>
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing"> </vaadin-horizontal-layout>
            `,
            root
        );
    };

    private truncate = (str: string, length: int = 50) => {
        return str.length > length ? str.substring(0, length - 3) + "..." : str;
    };

    private moodRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<TimeLine>) => {
        const stock = model.item;
        render(html`${stock.mood ? html`<vaadin-icon id="mood" icon="${stock.mood ? "lumo:arrow-up" : "lumo-arrow-down"}" theme="badge contrast primary pill small"></vaadin-icon>` : html``} `, root);
    };

    meta() {
        return {
            title: "Alerts",
            titleTemplate: "List of alerts",
            description: config.appDescription,
        };
    }
}

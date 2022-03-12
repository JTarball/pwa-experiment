/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, css, render } from "lit";
import { customElement, state, property } from "lit/decorators.js";

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

import "@vaadin/vaadin-lumo-styles/vaadin-iconset";
import "@vaadin/icon";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import "../components/alerts-stock.js";
import "../components/page-modal";
import "../components/home-alerts/alerts-per-stock.js";

@customElement("page-stocks")
export class PageStocks extends PageElement {
    @state()
    private items?: Stock[];

    @property()
    subtitle: String = "";

    @property()
    private modalOpen: Boolean = false;

    @property()
    private modalTitle: String = "";

    @property()
    private modalRenderer: TemplateResult;

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
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
            }
        `,
    ];

    private handleModalOpen(e: Event) {
        console.log("handleModalOpen", e.detail);
        this.modalTitle = e.detail.modalTitle;
        this.modalOpen = e.detail.modalOpen;
        this.modalRenderer = e.detail.modalRenderer;
    }

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}" @searchopen-changed=${this.handleModalOpen} subtitle=${this.subtitle}></top-navbar>

            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <!-- <alerts-stock @editopen-changed=${this.handleModalOpen}></alerts-stock> -->
                <stock-detail-alerts></stock-detail-alerts>
            </section>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- page modal -->
            <page-modal .title="${this.modalTitle}" ?open="${this.modalOpen}" @closed="${(e: CustomEvent) => (this.modalOpen = e.detail.value)}"> ${this.modalRenderer}</page-modal>

            <!-- The bottom tabs -->
            <bottom-navbar .location=${this.location}></bottom-navbar>
        `;
    }

    meta() {
        return {
            title: "Stock",
            titleTemplate: "Stock Quote",
            description: config.appDescription,
        };
    }
}

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

import "../components/modal-slide";

import "@vaadin/avatar";
import "@vaadin/button";
import "@vaadin/grid";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@vaadin/vaadin-lumo-styles/vaadin-iconset";
import "@vaadin/icon";

@customElement("page-stock-detail")
export class PageStockDetail extends PageElement {
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
        return html`<modal-slide title="SONOS" description="Sonos Inc." price="1200.2" priceChange="3.43"></modal-slide>`;
    }

    meta() {
        return {
            title: "Stocks",
            titleTemplate: "Stock Details",
            description: config.appDescription,
        };
    }
}

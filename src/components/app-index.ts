/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { RouterLocation } from "@vaadin/router";
import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import { attachRouter, urlForName, router, getLocation } from "../router/index.js";

import "pwa-helper-components/pwa-install-button.js";
import "pwa-helper-components/pwa-update-available.js";

import "./menu.js";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@material/mwc-icon-button";

//import { menuController } from '@ionic/core';
//import "@vaadin/vaadin-lumo-styles/all-imports";
import "@vaadin/app-layout";
import "@vaadin/icons";
import "@vaadin/icon";
import "@vaadin/tabs";
import "@vaadin/polymer-legacy-adapter";
import "@vaadin/vaadin-app-layout";

import "@vaadin/vaadin-app-layout/vaadin-drawer-toggle";
import "@vaadin/vaadin-avatar/vaadin-avatar";
import "@vaadin/vaadin-context-menu";
import "@vaadin/vaadin-tabs";
import "@vaadin/vaadin-tabs/vaadin-tab";

import "./top-navbar";
import "./bottom-navbar";
import { routes } from "../router/routes";

import "@vaadin/vaadin-lumo-styles/color.js";
import "@vaadin/vaadin-lumo-styles/spacing.js";
import "@vaadin/vaadin-lumo-styles/typography.js";
import "@vaadin/vaadin-app-layout/vaadin-app-layout.js";
import "@vaadin/vaadin-app-layout/vaadin-drawer-toggle.js";
import "@vaadin/vaadin-tabs/vaadin-tabs.js";
import "@vaadin/vaadin-tabs/vaadin-tab.js";
//import "@vaadin/vaadin-checkbox/vaadin-checkbox.js";
//import "../themes/yld0-theme/layout-styles.js";

//import { getClient } from "../store/client";

@customElement("app-index")
export class AppIndex extends LitElement {
    @query("main")
    private main!: HTMLElement;

    @state()
    protected location?: RouterLocation;

    @property({ type: Boolean, reflect: true }) dark;

    @property({ type: Object }) location2 = router.location;

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
        }

        header {
            display: flex;
            align-items: center;
            height: 53px;
            padding: 0 1rem;
        }

        header nav {
            display: flex;
            flex: 1;
            align-self: stretch;
        }

        header nav a {
            display: flex;
            align-items: center;
            color: #fff;
            font-weight: 600;
            text-decoration: none;
        }

        header nav a:not(:last-child) {
            margin-right: 1rem;
        }

        header nav a:hover {
            color: #bbb;
        }

        main,
        main > * {
            display: flex;
            flex: 1;
            flex-direction: column;
        }

        footer {
            padding: 1rem;
            text-align: center;
            background-color: #eee;
        }

        main:empty ~ footer {
            display: none;
        }

        /* main:not([dark]) {
            
        } */
        main[dark] {
            color: var(--lumo-primary-text-color);
            --lumo-font-family: -apple-system, BlinkMacSystemFont;
            --lumo-base-color: rgb(54, 67, 83);
            --lumo-primary-text-color: rgb(230, 175, 46);
            --lumo-primary-color-50pct: rgba(230, 175, 46, 0.5);
            --lumo-primary-color-10pct: rgba(230, 175, 46, 0.1);
            --lumo-primary-color: #e6af2e;
            --lumo-success-text-color: rgb(164, 175, 105);
            --lumo-success-color-50pct: rgba(164, 175, 105, 0.5);
            --lumo-success-color-10pct: rgba(164, 175, 105, 0.1);
            --lumo-success-color: #a4af69;
            --lumo-error-text-color: rgba(255, 250, 252, 0.99);
            --lumo-error-color-50pct: rgba(162, 37, 34, 0.5);
            --lumo-error-color-10pct: rgba(162, 37, 34, 0.1);
            --lumo-error-color: #a22522;
        }

        /* Page and Routing Animation */

        @keyframes slideFromRight {
            0% {
                transform: translateX(80%);
            }
            100% {
                transform: translateX(0);
            }
        }

        @keyframes slideFromLeftZero {
            0% {
                transform: translateX(-20%);
            }
            100% {
                transform: translateX(0%);
            }
        }

        @keyframes slideFromLeft {
            0% {
                transform: translateX(10%);
            }
            100% {
                transform: translateX(100%);
            }
        }

        @keyframes slideFromTop {
            0% {
                transform: translateY(5%);
            }
            100% {
                transform: translateY(100%);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }

            to {
                opacity: 0;
            }
        }

        /* Because of the menu we need to slide the entering parent into place */

        /* 
            Animated Page requirements

            - Main pages (bottom navigation) should not slide 
            - child pages should slide

            Problem: child pages cant slide out because it would make main page animation
            looks a bit shoddy with a partial slide.

            A fadeIn / out or main pages + a child slide in is the best we can do here.

        */

        main > .entering {
            /* This style is programmitically flipped when child pages are clicked */
            animation: fadeIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            z-index: 200;
        }

        main > .leaving {
            animation: fadeOut 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            z-index: 100;
        }

        main > .child-entering {
            animation: slideFromRight 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            z-index: 100;
        }

        /* End Page and Routing Animation */
    `;

    #checked(event) {
        this.dark = event.target.checked;
        const eDark = new CustomEvent("dark", {
            bubbles: true,
            composed: true,
            detail: "dark",
        });
        const eLight = new CustomEvent("light", {
            bubbles: true,
            composed: true,
            detail: "light",
        });
        event.target.checked ? this.dispatchEvent(eDark) : this.dispatchEvent(eLight);
    }

    constructor() {
        super();
        //  document.querySelector("apollo-client");
        //import { client } from "./global-apollo-client";
        //window.__APOLLO_CLIENT__ = client;
        // document.querySelector("apollo-client").client = getClient();
    }

    firstUpdated() {
        attachRouter(this.main);
    }

    render() {
        return html`
            <vaadin-app-layout primary-section="navbar|drawer">
                <!-- The main content is added / removed dynamically by the router -->
                <apollo-client>
                    <main role="main" ?dark="${this.dark}"></main>
                </apollo-client>

                <!-- slot, just in case -->
                <slot></slot>
            </vaadin-app-layout>
        `;
    }
}

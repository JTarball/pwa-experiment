/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, css } from "lit";
import { customElement } from "lit/decorators.js";

import "@vaadin/vaadin-lumo-styles/utility";

import config from "../config.js";
import { PageElement } from "../helpers/page-element.js";

import "../components/top-navbar";
import "../components/bottom-navbar";
import "../components/yld0-tabs";
import "../components/yld0-tab";
import "../components/yld0-tab";
import "../components/yld0-tabitem";
import "../components/tabs/insight-trends";
import "../components/tabs/insight-calendar";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";

@customElement("page-test")
export class PageTest extends PageElement {
    static styles = [
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
            html {
                height: 100%;
                overflow: hidden;
            }
            body {
                margin: 0;
                background: black;
                height: 100%;
                overflow: hidden;
                position: relative;
            }

            /* Center the story component */
            story-viewer {
                width: 400px;
                max-width: 100%;
                height: 80%;
                top: 50%;
                transform: translateY(-50%);
                margin: 0 auto;
            }

            /* Styles for specific story cards */
            .bottom {
                position: absolute;
                width: 100%;
                bottom: 48px;
                left: 0;
            }
            .bottom > * {
                margin: 0;
                text-align: center;
            }

            yld0-tabs {
                /* width: 300px;
                max-width: 100%;
                height: 80%;
                top: 50%;
                transform: translateY(-50%); */
                /* margin: 0 auto; */
            }
        `,
    ];

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}"></top-navbar>

            <!-- The main content is added / removed dynamically by the router -->

            <section>
                <yld0-tabs>
                    <yld0-tab title="Trends" disabled>
                        <insight-trends></insight-trends>
                    </yld0-tab>
                    <yld0-tab title="Calendar">
                        <insight-calendar></insight-calendar>
                    </yld0-tab>
                    <yld0-tab title="Calendar 2">
                        <insight-calendar></insight-calendar>
                    </yld0-tab>
                    <yld0-tab title="Calendar 3">
                        <insight-calendar></insight-calendar>
                    </yld0-tab>
                    <yld0-tab title="Calendar 4">
                        <insight-calendar></insight-calendar>
                    </yld0-tab>
                </yld0-tabs>
            </section>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- The bottom tabs -->
            <bottom-navbar .location=${this.location}></bottom-navbar>
        `;
    }

    meta() {
        return {
            title: config.appName,
            titleTemplate: null,
            description: config.appDescription,
        };
    }
}

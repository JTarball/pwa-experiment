/**
 * Page Home
 *
 * Properties down, events up is best practice for lit
 */

import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@vaadin/vaadin-lumo-styles/utility";

import config from "../config.js";
import { PageElement } from "../helpers/page-element.js";

import "../components/top-navbar";
import "../components/bottom-navbar";
import "../components/yld0-tabs";
import "../components/yld0-tab";
import "../components/yld0-tabitem";
import "../components/tabs/insight-trends";
import "../components/tabs/home-watchlist";
import "../components/tabs/home-recent";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";

@customElement("page-home")
export class PageHome extends PageElement {
    @property()
    private modalOpen: Boolean = false;

    @property()
    private modalTitle: String = "";

    @property()
    private modalRenderer: TemplateResult;

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
        `,
    ];

    private handleModalOpen(e: Event) {
        this.modalTitle = e.detail.modalTitle;
        this.modalOpen = e.detail.modalOpen;
        this.modalRenderer = e.detail.modalRenderer;
    }

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}" @searchopen-changed=${this.handleModalOpen}></top-navbar>

            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <yld0-tabs>
                    <yld0-tab title="Watching">
                        <home-watchlist></home-watchlist>
                    </yld0-tab>
                    <yld0-tab title="Recently Viewed">
                        <home-recent></home-recent>
                    </yld0-tab>
                </yld0-tabs>
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
            title: config.appName,
            titleTemplate: null,
            description: config.appDescription,
        };
    }
}

/**
 * Page Home
 *
 * Properties down, events up is best practice for lit
 */

import { html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import "@vaadin/vaadin-lumo-styles/utility";

import config from "../config.js";
import { PageElement } from "../helpers/page-element.js";

import "../components/organisms/top-navbar/top-navbar";
import "../components/templates/bottom-navbar";
import "../components/templates/yld0-tabs";
import "../components/organisms/tabs/yld0-tab";
import "../components/templates/yld0-tabitem";
import "../components/templates/tabs/insight-trends";
import "../components/templates/home-watchlist/watchlist";
import "../components/templates/home-recent/recent";

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

    @query("home-watchlist")
    _watchlist: Element;

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
                padding: 0.8rem;
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
                padding-bottom: 1rem;
            }
        `,
    ];

    private handleModalOpen(e: Event) {
        this.modalTitle = e.detail.modalTitle;
        this.modalOpen = e.detail.modalOpen;
        this.modalRenderer = e.detail.modalRenderer;
    }

    private handleModalClose(e: Event) {
        this.modalOpen = false;
    }

    async lemon(e: Event) {
        console.log("lemon");
        this.modalOpen = e.detail.value;
        await this._watchlist.query.refetch();
    }

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}" searchEnabled @searchopen-changed=${this.handleModalOpen}></top-navbar>

            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <yld0-tabs>
                    <yld0-tab title="Watching">
                        <home-watchlist @addvaluation-clicked=${this.handleModalOpen} @addfollow-clicked=${this.handleModalOpen}></home-watchlist>
                    </yld0-tab>
                    <yld0-tab title="Recently Viewed">
                        <home-recent></home-recent>
                    </yld0-tab>
                </yld0-tabs>
            </section>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- page modal -->
            <page-modal .title="${this.modalTitle}" ?open="${this.modalOpen}" @closed="${this.lemon}"> ${this.modalRenderer}</page-modal>

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

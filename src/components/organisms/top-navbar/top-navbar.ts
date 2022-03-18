import type { RouterLocation } from "@vaadin/router";
import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { cache } from "lit/directives/cache.js";

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
import "@vaadin/checkbox";
import "@vaadin/vaadin-tabs/vaadin-tab";
import "@vaadin/vaadin-lumo-styles/vaadin-iconset";
import { goPath, getBackUrl } from "../../../router/index.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { logoutUser } from "../../../auth/auth.js";

import "../../templates/search/search";

@customElement("top-navbar")
export class TopNavBar extends LitElement {
    @property()
    location?: RouterLocation;

    @property()
    subtitle: String = "";

    @property()
    searchEnabled: Boolean = false;

    @property({ type: Boolean, reflect: true }) drawerOpened = false;

    @property({ type: Boolean, reflect: true }) dark = true;

    @query("vaadin-app-layout")
    private layout!: HTMLElement;

    static styles = [
        themeStyles,
        utility,
        css`
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
                position: absolute;
                bottom: 0px;
                left: 0px;
                vertical-align: bottom;
            }

            main:empty ~ footer {
                display: none;
            }

            vaadin-button {
                box-shadow: var(--lumo-box-shadow-m);
                width: var(--lumo-size-l);
                height: var(--lumo-size-l);
            }

            .menu-footer-dark-mode {
                width: 100%;
                padding: var(--lumo-space-m);
            }
            .menu-footer-signout {
                width: 100%;
                padding: var(--lumo-space-xl);
            }

            #search {
                position: absolute;
                right: 20px;
                margin: 0 var(--lumo-space-s);
                color: var(--lumo-secondary-text-color);
            }

            #title {
                float: center;
                margin-top: 0px;
                margin-bottom: 0px;
                font-weight: 500;
            }

            #subtitle {
                margin-top: 0px;
                margin-bottom: 0px;
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-micro);
                animation: 1s 0.03s elasticExpand cubic-bezier(0.215, 0.61, 0.355, 1) both;
            }

            #back {
                height: 24px;
                color: var(--lumo-secondary-text-color);
                margin-left: 8px;
                margin-right: 8px;
                font-size: 16px;
                width: 44px;
            }
        `,
    ];

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

    private searchRenderer() {
        return html` <search-list></search-list> `;
    }

    private _clickSearch() {
        var event = new CustomEvent("searchopen-changed", { detail: { modalOpen: true, modalTitle: "", modalRenderer: this.searchRenderer() } });
        this.dispatchEvent(event);
    }

    private goBack(_: Event, url: string) {
        goPath(url);
    }

    private async handleLogout() {
        await logoutUser();
        goPath("/login", "");
    }

    private firstUpdated() {
        // Workaround for the following:
        //  true, for desktop size views
        //  false, for mobile size views
        // We want to set it to close always by default
        this.layout?.removeAttribute("drawer-opened");
    }

    render() {
        return html`
            <vaadin-app-layout primary-section="drawer">
                <header class="bg-base border-b border-contrast-10 box-border flex h-xl items-center w-full" slot="navbar">
                    ${
                        getBackUrl()
                            ? html`<vaadin-icon id="back" icon="lumo:angle-left" @click=${(e) => this.goBack(e, getBackUrl())}></vaadin-icon>`
                            : html`<vaadin-drawer-toggle
                                  slot="navbar [touch-optimized]"
                                  @click=${this.setDarkMode}
                                  aria-label="Menu toggle"
                                  class="text-secondary"
                                  theme="contrast"
                              ></vaadin-drawer-toggle>`
                    } 
                    <div style="width: 50%">
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                    <!-- <vaadin-avatar img="" name="${this.location?.route?.title}" theme="xsmall"></vaadin-avatar> -->
                    <!-- <h4 id="title">${this.location?.params.symbol} ${this.location?.route?.title}</h4> -->
                   
                    <span id="subtitle">${this.subtitle}</span>
                       
                    </vaadin-vertical-layout>
                    </div>
                    <!-- <img src = "images/yld0-icon.svg" alt="My Happy SVG" style="width:50px;"/> -->
                    <!-- ${this.searchEnabled ? html`<vaadin-icon id="search" icon="lumo:search" @click=${this._clickSearch}></vaadin-icon>` : html``} -->
                    <vaadin-icon id="search" icon="lumo:search" @click=${this._clickSearch}></vaadin-icon>


                </header>
                <section class="flex flex-col items-stretch max-h-full min-h-full" slot="drawer">
                    <h2 class="flex items-center h-xl m-0 px-m text-m">Danvir Guram</h4>
                    <nav aria-labelledby="views-title" class="border-b border-contrast-10 flex-grow overflow-auto">
                        <vaadin-tabs orientation="vertical">
                            <vaadin-tab>
                                <vaadin-icon icon="lumo:cog"></vaadin-icon>
                                <span>Profile & Settings</span>
                            </vaadin-tab>
                            <vaadin-tab>
                                <vaadin-icon icon="vaadin:academy-cap"></vaadin-icon>
                                <span>Tutorial</span>
                            </vaadin-tab>
                            <vaadin-tab>
                                <vaadin-icon icon="vaadin:info-circle"></vaadin-icon>
                                <span>Request Feature</span>
                            </vaadin-tab>
                            <vaadin-tab>
                                <vaadin-checkbox label="Use Dark Mode" @click=${this.#checked} .checked=${this.dark}></vaadin-checkbox>
                            </vaadin-tab>
                        </vaadin-tabs>
                    </nav>

                    <footer>
                        <div class="menu-footer-signout">
                            <vaadin-button class="m-xl mx-auto" theme="large primary" @click="${this.handleLogout}">Sign Out</vaadin-button>
                        </div>
                    </footer>
                </section>
            </vaadin-app-layout>
        `;
    }

    private setDarkMode() {
        console.log("setDarkMode");
        document.documentElement.setAttribute("theme", "dark");
    }
}

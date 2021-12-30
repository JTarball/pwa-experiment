import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import "@vaadin/tabs";
import "@vaadin/icon";
import type { RouterLocation } from "@vaadin/router";
import { Notification } from "@vaadin/notification";

import config from "../config.js";
import { urlForName, titleForName } from "../router/index.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";

@customElement("bottom-navbar")
export class BottomNavBar extends LitElement {
    @property()
    location?: RouterLocation;

    @query("#home")
    private _home?: Element;

    @query("#alerts")
    private _alerts?: Element;

    @query("#insight")
    private _insight?: Element;

    @query("#history")
    private _history?: Element;

    static styles = [
        themeStyles,
        css`
            :host {
                background: var(--lumo-base-color);
            }

            h1 {
                font-size: var(--lumo-font-size-l);
                margin: var(--lumo-space-m) var(--lumo-space-l);
            }

            vaadin-icon {
                height: var(--lumo-icon-size-s);
                margin: 8px auto;
                width: var(--lumo-icon-size-s);
            }

            vaadin-tabs {
                position: absolute;
                bottom: 0px;
                left: 0px;
                vertical-align: bottom;
                width: 100%;
                background: var(--lumo-base-color);
            }
            div.item {
                vertical-align: top;
                display: inline-block;
                text-align: center;
                width: 50px;
            }
            div.item a {
                color: rgba(26, 57, 96, 0.4);
                text-decoration: none;
                font-size: var(--lumo-font-size-tiny);
            }

            div.item a.active {
                color: var(--lumo-primary-text-color);
                text-decoration: none;
                font-size: var(--lumo-font-size-tiny);
            }

            span.caption {
                padding: 10px;
                font-size: 0.7em;
            }

            footer {
                padding: 1rem;
                text-align: center;
                background-color: var(--lumo-base-color);
                display: block;
                width: 100%;
                height: 40px;
                overflow: hidden;
                position: fixed;
                bottom: 0;
            }

            main:empty ~ footer {
                display: none;
            }
        `,
    ];

    private firstUpdated() {
        this.switchPage();
    }

    private _removeActive() {
        // Reset Tabs
        this._home?.classList.remove("active");
        this._alerts?.classList.remove("active");
        this._insight?.classList.remove("active");
        this._history?.classList.remove("active");
    }

    private switchPage() {
        console.debug("switchPage", this.location?.pathname);
        this._removeActive();

        switch (this.location?.pathname) {
            case urlForName("home"):
                this._home?.classList.add("active");
                break;
            case urlForName("alerts"):
                this._alerts?.classList.add("active");
                break;
            case urlForName("insight"):
                this._insight?.classList.add("active");
                break;
            case urlForName("history"):
                this._history?.classList.add("active");
                break;
            default:
                this._home?.classList.add("active");
        }
    }

    render() {
        return html`
            <footer>
                <!-- <span>Environment: ${config.environment}</span> -->
                <vaadin-tabs slot="navbar touch-optimized" theme="minimal equal-width-tabs">
                    <vaadin-tab>
                        <div class="item">
                            <a id="home" @click="${this.switchPage()}" href="${urlForName("home")}" tabindex="-1">
                                <vaadin-icon icon="vaadin:home-o"></vaadin-icon>
                                <span class="caption">${titleForName("home")}</span>
                            </a>
                        </div>
                    </vaadin-tab>
                    <vaadin-tab>
                        <div class="item">
                            <a id="alerts" @click="${this.switchPage()}" href="${urlForName("alerts")}" tabindex="-1">
                                <vaadin-icon icon="vaadin:bell-o"></vaadin-icon>
                                <span class="caption">${titleForName("alerts")}</span>
                            </a>
                        </div>
                    </vaadin-tab>
                    <vaadin-tab>
                        <div class="item">
                            <a id="insight" @click="${this.switchPage()}" href="${urlForName("insight")}" tabindex="-1">
                                <vaadin-icon icon="vaadin:trending-down"></vaadin-icon>
                                <span class="caption">${titleForName("insight")}</span>
                            </a>
                        </div>
                    </vaadin-tab>
                    <vaadin-tab>
                        <div class="item">
                            <a id="history" @click="${this.switchPage()}" href="${urlForName("history")}" tabindex="-1">
                                <vaadin-icon icon="vaadin:time-backward" @click="${this.sayHello}"></vaadin-icon>
                                <span class="caption">${titleForName("history")}</span>
                            </a>
                        </div>
                    </vaadin-tab>
                </vaadin-tabs>
            </footer>
        `;
    }

    private sayHello() {
        //Notification.show("Hello");
    }
}

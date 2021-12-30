/* Full Page Modal */
import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";

import { animated } from "../themes/yld0-theme/components/animated.js";
import { fadeInLeft } from "../themes/yld0-theme/components/fade.js";
import { slideUp } from "../themes/yld0-theme/components/slide.js";
// import { fadeInUpSmall } from "../themes/yld0-theme/components/fadeInUpSmall.js";

import "./news-list.js";
import "./stock-alerts.js";
import "./table.js";

import "./tabs/stock-info.js";
import "./tabs/stock-insight.js";

@customElement("modal-slide")
class ModalSlide extends LitElement {
    @property()
    private visible: Boolean = true;

    @property()
    private title: String;

    @property()
    private description: String;

    @property()
    private price: Number;

    @property()
    private priceChange: Number;

    @query(".wrapper")
    private _wrapper: Element;

    @query("#alerts")
    private _alerts: Element;

    @query("#insight")
    private _insight: Element;

    @query("#info")
    private _info: Element;

    @query("#news")
    private _news: Element;

    @query("#transactions")
    private _transactions: Element;

    @query("#social")
    private _social: Element;

    static styles = [
        badge,
        utility,
        spacing,
        animated,
        slideUp,
        fadeInLeft,
        themeStyles,
        css`
            /* handle the light / dark mode */
            /* :host:not([dark]) {
                  --bk-color: #eee;
              }
              :host([dark]) {
                  color: red;
              } */
            .wrapper {
                /* position: fixed;
                width: 100%;
                height: 100%;
                opacity: 0; */
                /*visibility: hidden;*/
            }

            /* #modal {
                font-family: Helvetica;
                font-size: 14px;
                padding: 10px 10px 5px 10px;
                position: absolute;
                left: -100px;
                width: 100px;
                height: 100px;
                background-color: blue;
                -webkit-animation: slide 0.5s forwards;
                -webkit-animation-delay: 2s;
                animation: slide 0.5s forwards;
                animation-delay: 2s;
            }

            @-webkit-keyframes modal {
                100% {
                    left: 100;
                }
            }

            @keyframes modal {
                100% {
                    left: 100;
                } */
            }

            /* .visible {
                visibility: visible;
                opacity: 1;
            } */

            /* .visible {
                opacity: 1;
                visibility: visible;
                transform: scale(1);
                transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s; 

                 width: 350px;
                height: 600px;
                transition: width 6000ms ease-out, height 600ms ease-out; 
            } */

            /* #reback {
                margin: var(--lumo-space-s);
                color: var(--lumo-secondary-text-color);
                width: 44px;
                height: 44px;
            } */



            .button-container {
                text-align: right;
            }
            button {
                min-width: 80px;
                background-color: #848e97;
                border-color: #848e97;
                border-style: solid;
                border-radius: 2px;
                padding: 3px;
                color: white;
                cursor: pointer;
            }
            button:hover {
                background-color: #6c757d;
                border-color: #6c757d;
            }
            lemon {
                display: inline-block;
            }






            /* #title {
                text-align: center;
            } */


            #header {
                align: center;
                width: 70%;
            }

            #priceChange {
                font-size: var(--lumo-font-size-xxs);
            }

            /* tabs activation */
            section > article { display:none; }
            section > article.active { display:block; }
            /* end of tab activation */

        `,
    ];

    firstUpdated() {
        this._removeActive();
        this._insight.classList.add("active");
        window.localStorage.setItem("stocks-recent-viewed", JSON.stringify({ symbol: "TSLA" }));
        console.log(window.localStorage);
        var user = JSON.parse(window.localStorage.getItem("stocks-recent-viewed"));
        console.log(user);
        //localStorage.setItem('myCat', 'Tom');
    }

    private _handleCancel(e) {
        //console.log(e);
        //const cancelButton = this.shadowRoot.querySelector(".wrapper");
        //this._wrapper.removeAttribute("visible");
        this._wrapper.classList.add("poo");
        //history.back();
    }

    private truncate = (str: string, length: int = 10) => {
        return str.length > length ? str.substring(0, length - 3) + "..." : str;
    };

    private _removeActive() {
        this._alerts.classList.remove("active");
        this._insight.classList.remove("active");
        this._info.classList.remove("active");
        this._news.classList.remove("active");
        this._transactions.classList.remove("active");
        this._social.classList.remove("active");
    }

    private handleSelectChanged(e) {
        console.log("selected", e.detail.value);

        this._removeActive();

        switch (e.detail.value) {
            case 0:
                this._alerts.classList.add("active");
                break;
            case 1:
                this._insight.classList.add("active");
                break;
            case 2:
                this._info.classList.add("active");
                break;
            case 3:
                this._news.classList.add("active");
                break;
            case 4:
                this._transactions.classList.add("active");
                break;
            case 5:
                this._social.classList.add("active");
                break;
            default:
                this._alerts.classList.add("active");
            // code block
        }
    }

    render() {
        const wrapper = this.visible ? "wrapper visible" : "wrapper";
        return html` <div class="${wrapper}" visible>
            <header class="bg-base border-b border-contrast-10 box-border flex h-xl items-center w-full" slot="navbar">
                <vaadin-icon size="40" id="reback" icon="lumo:angle-left" @click=${this._handleCancel}></vaadin-icon>
                <vaadin-vertical-layout class="m-auto" style="line-height: var(--lumo-line-height-m);">
                    <span id="title">${this.title}</span>
                    <span id="description" style="font-size: var(--lumo-font-size-s); color: var(--lumo-secondary-text-color);">${this.truncate(this.description)}</span>
                </vaadin-vertical-layout>
                <!-- <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                    <span id="price">${this.price}</span>
                    <span id="priceChange" theme="badge ${this.priceChange > 0 ? "success" : "error"}">1d ${this.priceChange > 0 ? "+" : ""}${this.priceChange}%</span>
                </vaadin-vertical-layout> -->
            </header>

            <div class="content">
                <slot>
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <span id="price">${this.price}</span>
                        <span id="priceChange" theme="badge ${this.priceChange > 0 ? "success" : "error"}">1d ${this.priceChange > 0 ? "+" : ""}${this.priceChange}%</span>
                    </vaadin-vertical-layout>
                    <vaadin-tabs @selected-changed=${this.handleSelectChanged}>
                        <vaadin-tab>Alerts</vaadin-tab>
                        <vaadin-tab>Insight</vaadin-tab>
                        <vaadin-tab>Info/Tcls</vaadin-tab>
                        <vaadin-tab>News</vaadin-tab>
                        <vaadin-tab>Transactions</vaadin-tab>
                        <vaadin-tab disabled>Social</vaadin-tab>
                    </vaadin-tabs>

                    <section>
                        <article id="alerts"><stock-alerts></stock-alerts></article>
                        <article id="insight"><stock-insight></stock-insight></article>
                        <article id="info"><yld0-table></yld0-table></article>
                        <article id="news"><news-list></news-list></article>
                        <article id="transactions"><stock-info></stock-info></article>
                        <article id="social">social</article>
                    </section>
                </slot>
            </div>
        </div>`;
    }
}

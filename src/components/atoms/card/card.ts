// Inspired by https://codepen.io/Nippy/pen/eYVOpME
import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/icon";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../../atoms/text-area/text-area";
import "../../atoms/checkbox/check-box";
import "../../atoms/grade/grade";
import "../../atoms/pass-fail/pass-fail";
import "../../atoms/container-accordion/container-accordion";
import "../../organisms/checks-table/checks-table";

@customElement("y-card")
export class YCard extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Number })
    width?;

    @property({ type: Number })
    height?;

    @property({ type: String })
    title: string = "";

    @property({ type: Object })
    startingPos?: Object; // absolute starting Position of the web component

    @property({ type: Boolean, reflect: true })
    add: boolean = false;

    @property({ type: Boolean })
    valid: boolean = false;

    @property({ type: Boolean, reflect: true })
    open: boolean = false;

    @property({ type: Boolean, reflect: true })
    noFooter: boolean = false;

    @property({ type: Boolean, reflect: true })
    noMargin: boolean = false;

    @query("div.container")
    _container;

    @query("div.container-wrapper")
    _container_wrapper;

    @query("div.accordion")
    _accordion;

    @query("#iconPin")
    _pin;

    // -- End of properties, queries etc. -- //

    static styles = [
        utility,
        themeStyles,
        css`
            :host {
                display: inline-block;
                margin: 1rem;
            }

            :host([noMargin]) {
                margin: 0;
            }

            .container-wrapper {
                /* position: absolute; */
                display: inline-block;
                margin: 0.1rem;
                /* position: absolute; */
                inset: 0px auto auto 0px;
                margin: 0px;
                background-color: var(--lumo-base-color);
                z-index: 100;
            }

            .container {
                /* min-width: 340px;
                min-height: 500px;
                width: 340px;
                height: 500px; */
                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                display: flex;
                flex-direction: column;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0.07);
                box-shadow: rgb(0 0 0 / 6%) 0px 8px 14px, rgb(0 0 0 / 4%) 0px 12px 16px;

                -webkit-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -moz-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -o-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
            }

            /* Card Style */

            header {
                border-bottom: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                padding: 1rem;
                margin: 1rem;
                margin-top: 30px;
                padding-top: 0;
                margin-bottom: 0.3rem;
                padding-bottom: 0.6rem;

                /* height: 55px; */
            }

            span.description {
                font-size: var(--lumo-font-size-s);
            }

            .body {
                padding: 1rem;
                padding-top: 0.6rem;
                /* height: 225px; */
            }

            footer {
                padding: 0;
                background-color: #f7f7f9;
                border-top: 1px solid rgba(0, 0, 0, 0.125);
                min-width: 100%;
                /* push footer to bottom */
                margin-top: auto;
                /* ensure width includes padding */
                box-sizing: border-box;
            }

            .footer {
                padding: 0.75rem 1.25rem;
            }

            /* End of Card Style */

            #expandShrink {
                margin-left: auto;
                position: absolute;
                right: 0px;
                top: 0px;
            }

            #iconPin {
                padding: 0;
                font-size: small;
                margin: 0.5rem;
                margin-top: 0em;
                margin-left: auto;
            }

            #iconPin[clicked] {
                color: white;
                background-color: var(--default-primary-color);
            }

            .scaled {
                height: 700px;
                width: 700px;

                transition: height 1s;
                -webkit-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -moz-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -o-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
            }

            ::slotted(div[slot="header"]) {
                margin-left: auto;
            }

            #toggleButton {
                background-color: var(--lumo-shade-5pct);
            }
            #toggleButton:hover {
                background-color: var(--lumo-shade-10pct);
            }

            .accordion {
                padding: 0;
                background-color: rgb(255 255 255 / 50%);
                /* border-top: 1px solid rgba(0, 0, 0, 0.125); */
                min-width: 100%;
                /* push footer to bottom */
                margin-top: auto;
                /* ensure width includes padding */
                box-sizing: border-box;
                height: 0px;

                overflow: scroll;

                -webkit-transition: height 0.5s ease-in-out, padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
                -moz-transition: height 0.5s ease-in-out, padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
                -o-transition: height 0.5s ease-in-out, padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
                transition: height 0.5s ease-in-out, padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;

                /* max-height: 200px; */
            }

            :host([open]) .accordion {
                height: 350px;
            }

            .list-unstyled {
                overflow-x: scroll;
                background: #eeeeee;
                margin-bottom: 0;
                box-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.25);
                margin-top: 0;

                li {
                    border-bottom: 1px dotted #cccccc;
                    padding: 5px $padding-base * 2;
                    overflow: hidden;
                    width: 100%;
                    display: block;
                    position: relative;

                    .btn-buy {
                        position: absolute;
                        right: 15px;
                        top: 13px;

                        padding: 8px 20px;
                        border-radius: 6px;
                        background: #00bbff;
                        border: 0;
                        opacity: 0;
                        @include transition(300ms);
                    }

                    &:hover {
                        .btn-buy {
                            opacity: 1;
                        }
                    }
                    &:last-child {
                        border-bottom: none;
                    }
                    &:before,
                    &:after {
                        display: table;
                        content: " ";
                        clear: both;
                    }

                    .price {
                        .value {
                            color: #444444;
                            font-size: 22px;
                            margin-top: 10px;
                        }
                    }
                }
            }
        `,
    ];

    // -- Start of lifecycle methods -- //

    protected firstUpdated() {
        if (this.width) {
            this._container.style.width = `${this.width}px`;
        } else {
            this._container.style.width = `100%`;
        }

        if (this.height) {
            this._container.style.height = `${this.height}px`;
        }

        // if (this.height) {
        //     this._container.style.height = `${this.height}px`;
        // }
    }

    // update(changedProperties) {

    //     super.update(changedProperties);
    // }

    // -- Functions -- //

    handleAdd() {
        var event = new CustomEvent("add", { detail: {} });
        this.dispatchEvent(event);
        this.close();
    }

    handleSave() {
        var event = new CustomEvent("save", { detail: {} });
        this.dispatchEvent(event);

        // if (!this.sticky) {
        //     this.close();
        // }
    }

    handleFinancialChecksRow(items: [Object]) {
        const rows = [];
        items.map((row, index) => {
            rows.push(html`
                <tr role="row" index="${index}">
                    <td class="ellipsis_cell">
                        <div><span>Lemon</span></div>
                    </td>
                </tr>
            `);
        });
        return html` ${rows.map((i) => html`${i}`)} `;
    }

    /* Support for sticky drag */

    /* End of Support for sticky drag */

    // -- Main Render -- //
    render() {
        return html`
            <div class="container-wrapper">
                <div class="container">
                    <header>
                        <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                            <slot name="preTitle"></slot>
                            <span class="description">${this.title}</span>
                            <slot name="header"></slot>
                            <!-- <vaadin-button id="iconPin" theme="icon" aria-label="pin">
                                <grade-box score="93"></grade-box>
                            </vaadin-button> -->
                        </vaadin-horizontal-layout>
                    </header>
                    <div class="body">
                        <slot name="body"></slot>

                        <ul></ul>
                    </div>

                    ${this.noFooter
                        ? html``
                        : html`
                              <footer>
                                  <div class="accordion">
                                      <checks-table symbol="MSFT"></checks-table>

                                      <!-- <ul class="list-unstyled">
                                <li>
                                    <div class="ticket">
                                        <h5>
                                            Basic Ticket<br />
                                            <small>25 Tickets left</small>
                                        </h5>
                                    </div>
                                    <div class="price">
                                        <div class="value"><b>₽</b>699</div>
                                    </div>
                                    <a href="#" class="btn btn-info btn-sm btn-buy">Купить</a>
                                    <pass-fail score="93"></pass-fail>
                                </li>
                                <li>
                                    <div class="ticket">
                                        <h5>
                                            Regular Ticket<br />
                                            <small>15 Tickets left</small>
                                        </h5>
                                    </div>
                                    <div class="price">
                                        <div class="value"><b>₽</b>799</div>
                                    </div>
                                    <a href="#" class="btn btn-info btn-sm btn-buy">Купить</a>
                                </li>
                                <li>
                                    <div class="ticket">
                                        <h5>
                                            Premium Ticket<br />
                                            <small>62 Tickets left</small>
                                        </h5>
                                    </div>
                                    <div class="price">
                                        <div class="value"><b>₽</b>1,299</div>
                                    </div>
                                    <a href="#" class="btn btn-info btn-sm btn-buy">Купить</a>
                                </li>
                                <li>
                                    <div class="ticket">
                                        <h5>
                                            VIP Ticket<br />
                                            <small>6 Tickets left</small>
                                        </h5>
                                    </div>
                                    <div class="price">
                                        <div class="value"><b>₽</b>1,799</div>
                                    </div>
                                    <a href="#" class="btn btn-info btn-sm btn-buy">Купить</a>
                                </li>
                            </ul> -->
                                  </div>
                                  <div class="footer">
                                      <!-- <vaadin-horizontal-layout>
                                <vaadin-button
                                    id="toggleButton"
                                    theme="small"
                                    @click=${() => {
                                          this.open = !this.open;
                                      }}
                                    >${this.open ? "Hide" : "Show Checks"}</vaadin-button
                                >
                                <vaadin-button style="margin-left: auto;" ?disabled=${!this.valid} theme="small" @click=${this.handleAdd}>9/10 Checks</vaadin-button>
                            </vaadin-horizontal-layout> -->
                                  </div>
                              </footer>
                          `}
                </div>
            </div>
        `;
    }
}

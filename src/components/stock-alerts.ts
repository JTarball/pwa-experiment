/* Full Page Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/grid";
import "@vaadin/button";
import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/text-field";
import "@vaadin/vertical-layout";
import "@vaadin/text-area";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import type { GridItemModel } from "@vaadin/grid";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { UserStockAlert } from "../store/models.js";

import { guard } from "lit/directives/guard.js";
import { truncate } from "../helpers/utilities/helpers.js";

//import "./modal-centre.js";

import "hammerjs";

@customElement("stock-alerts")
class StockAlerts extends LitElement {
    @state()
    private items?: UserStockAlert[];

    @property()
    private modalAlert?: UserStockAlert;

    @state()
    private dialogOpened = false;

    @state()
    private activeItem;

    @state()
    private movedX = 0;

    // Data emitted by Hammer.js
    @state() _panData: { isFinal?: boolean; deltaX?: number; target } = {};

    @queryAll("tbody")
    private _slideable!: NodeListOf<Element>;

    constructor() {
        super();
        this.index = 0;
        new Hammer(this).on("panleft", (e: HammerInput) => (this._panData = e));
    }

    update(changedProperties: PropertyValues) {
        let { deltaX = 0, isFinal = false } = this._panData;

        // Guard against an infinite loop by looking for index.
        if (!changedProperties.has("_index") && isFinal) {
            //deltaX > 0 ? this.previous() : this.next();
        }

        // We don't want any deltaX when releasing a pan.
        //deltaX = isFinal ? 0 : deltaX;
        //const width = this.clientWidth;
        console.log(this._slideable, this._slideable.length);
        Array.from(this._slideable).forEach((el: Element, i) => {
            // Updated this line to utilize deltaX.
            var x = deltaX;
            //var x = deltaX > 100 ? 100 : deltaX;
            // x = deltaX < -100 ? -100 : deltaX;

            //if (x <= 100 && x >= -100 && x != 0) {
            console.log("movedX");
            (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
            this.movedX = x;
            //}
        });

        console.log("update", deltaX, isFinal);
        super.update(changedProperties);
    }

    static styles = [
        badge,
        utility,
        spacing,
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

            #header {
                display: block;
            }

            .dialogCreated {
                font-size: var(--lumo-font-size-xxs);
            }

            .vaadin-button-container {
                padding: 0px;
            }

            .slide-in {
                animation: slide-in 0.5s forwards;
                -webkit-animation: slide-in 0.5s forwards;
            }

            vaadin-vertical-layout {
                /* animation: slide-out 0.5s forwards;
                -webkit-animation: slide-out 0.5s forwards; */
            }

            @keyframes slide-in {
                100% {
                    transform: translateX(0%);
                }
            }

            @-webkit-keyframes slide-in {
                100% {
                    -webkit-transform: translateX(0%);
                }
            }

            @keyframes slide-out {
                0% {
                    transform: translateX(0%);
                }
                100% {
                    transform: translateX(-10%);
                }
            }

            @-webkit-keyframes slide-out {
                0% {
                    -webkit-transform: translateX(0%);
                }
                100% {
                    -webkit-transform: translateX(-10%);
                }
            }

            @keyframes slide-right {
                0% {
                    transform: translateX(0%);
                }
                100% {
                    transform: translateX(50%);
                }
            }

            @-webkit-keyframes slide-right {
                0% {
                    -webkit-transform: translateX(0%);
                }
                100% {
                    -webkit-transform: translateX(50%);
                }
            }

            @keyframes slide-left {
                0% {
                    transform: translateX(0%);
                }
                100% {
                    transform: translateX(-100px);
                }
            }

            @-webkit-keyframes slide-left {
                0% {
                    -webkit-transform: translateX(0%);
                }
                100% {
                    -webkit-transform: translateX(-100px);
                }
            }

            /* Hidden Delete Column */
            .deleteCol {
                position: relative;
                left: 100px;
                transition: transform 0.35s ease-out;
            }
            /* .deleteCol.deleteCol {
                animation: slide-left 0.5s forwards;
                -webkit-animation: slide-left 0.5s forwards;
            } */
        `,
    ];

    async firstUpdated() {
        const alerts: UserStockAlert[] = [
            {
                uuid: "35992974-21ea-4f61-b715-2dfaed663b73",
                title: "Upper limit at $40",
                notes: "Think about selling because this is an great time to do it. I really need to think about this one and then proceed with extreme velocity using the power of grayskull.",
                date: new Date().toISOString(),
                notification_types: [],
                enabled: true,
            },
            { uuid: "55937074-21ea-4f61-b723-2dfaed663b74", title: "Lower limit at $40", notes: "Think about selling", date: new Date().toISOString(), notification_types: [], enabled: false },
            { uuid: "45938574-21ea-4f61-b716-2dfaed663b75", title: "Price change by 10%", notes: "Think about selling", date: new Date().toISOString(), notification_types: [], enabled: true },
        ];
        this.items = alerts;
    }

    private showModal(uuid: String) {
        this.modalAlert = this.items?.filter((item) => item.uuid == uuid)[0];
        this.modalVisible = true;
        console.log(this.modalAlert, this.modalVisible);
    }

    private handleDrag(e, unde) {
        console.log("handleDrag");
        console.log(e, unde);
    }

    private alertsRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<UserStockAlert>) => {
        const alert = model.item;
        render(
            html`
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                    <!-- <vaadin-avatar img="${alert.pictureUrl}" name="${alert.title}" alt="User avatar"></vaadin-avatar> -->
                    <!-- @click=${() => this.showModal(alert.uuid)} -->
                    <vaadin-vertical-layout id="vert-${alert.uuid}" style="line-height: var(--lumo-line-height-m);" @swipe=${this.handleDrag}>
                        <span> ${alert.title}</span>
                        <span style="font-size: var(--lumo-font-size-s); color: var(--lumo-secondary-text-color);"> ${truncate(alert.notes, 140)} </span>
                        <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                            <!-- <span style="font-size: var(--lumo-font-size-xxs); color: var(--lumo-secondary-text-color);">created 30 mins ago</span> -->
                            <span style="font-size: var(--lumo-font-size-xxs); color: var(--lumo-secondary-text-color);">triggered 5 mins ago</span>
                        </vaadin-horizontal-layout>
                    </vaadin-vertical-layout>
                </vaadin-horizontal-layout>
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing"> </vaadin-horizontal-layout>
            `,
            root
        );
    };

    private toggleRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<UserStockAlert>) => {
        const alert = model.item;

        render(
            html`
                <vaadin-horizontal-layout>
                    <paper-toggle-button ?checked=${!alert.enabled}></paper-toggle-button>
                </vaadin-horizontal-layout>
            `,
            root
        );
    };

    private deleteRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<UserStockAlert>) => {
        const alert = model.item;

        render(
            html`
                <vaadin-horizontal-layout class="deleteCol">
                    <vaadin-button id="delete"><vaadin-icon theme="error" icon="lumo:cross"></vaadin-icon></vaadin-button>
                </vaadin-horizontal-layout>
            `,
            root
        );
    };

    private headerRenderer = (root: HTMLElement, _: HTMLElement) => {
        render(
            html`
                <vaadin-horizontal-layout>
                    <div class="" style="float: right">
                        <vaadin-button><vaadin-icon id="iconAddAlert" icon="lumo:bell">Add alert</vaadin-icon><vaadin-icon icon="lumo:plus">Add alert</vaadin-icon></vaadin-button>
                    </div>
                </vaadin-horizontal-layout>
            `,
            root
        );
    };

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <vaadin-grid .items="${this.items}">
                    <vaadin-grid-column
                        activeItem=${this.activeItem}
                        frozen
                        width="80%"
                        flex-grow="0"
                        .headerRenderer="${this.headerRenderer}"
                        .renderer="${this.alertsRenderer}"
                        flex-grow="0"
                    ></vaadin-grid-column>
                    <vaadin-grid-column .renderer="${this.toggleRenderer}" auto-width></vaadin-grid-column>
                    <vaadin-grid-column .renderer="${this.deleteRenderer}" auto-width></vaadin-grid-column>
                </vaadin-grid>
            </section>
            <!-- <modal-centre title="${this.modalAlert?.title}" .visible=${this.modalVisible}>
                <div>hjkfdkjhfhkjdfhjdffdsjhfhkjsdjhskkjhfdsjhfdjkhfdsjhkfdkjh</div>
            </modal-centre> -->

            <vaadin-button @click="${() => (this.dialogOpened = true)}"> Show dialog </vaadin-button>
            <vaadin-dialog
                aria-label="System maintenance notice"
                .opened="${this.dialogOpened}"
                @opened-changed="${(e: CustomEvent) => (this.dialogOpened = e.detail.value)}"
                .renderer="${guard([], () => (root: HTMLElement) => {
                    render(
                        html`
                            <vaadin-vertical-layout theme="spacing" style="width: 300px; max-width: 100%; align-items: stretch;">
                                <h2 style="margin: var(--lumo-space-m) 0; font-size: 1.5em; font-weight: bold;">${this.modalAlert?.title}</h2>
                                <p class="dialogCreated">Created ${this.modalAlert?.date}.</p>
                                <vaadin-text-area label="Notes" value="${this.modalAlert?.notes}"></vaadin-text-area>
                                <vaadin-button @click="${() => (this.dialogOpened = false)}" style="align-self: flex-left;"> Delete </vaadin-button>
                                <vaadin-button @click="${() => (this.dialogOpened = false)}" style="align-self: flex-end;"> Close </vaadin-button>
                            </vaadin-vertical-layout>
                        `,
                        root
                    );
                })}"
            ></vaadin-dialog>

            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

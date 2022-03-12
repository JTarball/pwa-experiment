/* Full Page Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";

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

import { ref } from "lit/directives/ref.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { UserStockAlert } from "../store/models.js";

import { guard } from "lit/directives/guard.js";
import { truncate } from "../helpers/utilities/helpers.js";

//import "./modal-centre.js";

import { HammerController } from "../controllers/hammer-controller";

import "hammerjs";

function hammerIt(element) {
    console.log("hammer", this, element);
    // const el = document.querySelector("#el");
    // const hammer = new Hammer(el);
    // const onPan = (e) => {
    //     console.log(e);
    // };
    // hammer.on("press", onPan);

    // new Hammer(this._slideable[0]).on("pan", (e: HammerInput) => (this._panData = e));
}

@customElement("yld0-table")
class YLD0Table extends LitElement {
    // Reactive controller for hammer gestures
    private _ = new HammerController(this, { tap: {}, pan: {} }, { panleft: { selectors: [".lemon"] }, panright: { selectors: [".lemon"] }, tap: { selectors: [".lemon"] }, options: {} });

    // Slide table row properties
    @state()
    private slideIsOpen: Boolean = false; // The current movement from the original (reset) position.

    // multiple slides
    // elastic..?

    // Other

    @property() shadowName = "";

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

    @queryAll('tr[role="row"]')
    private _slideable!: NodeListOf<Element>;

    @queryAll(".lemon")
    private _lemon!: NodeListOf<Element>;

    constructor() {
        super();
        //new Hammer(this).on("pan", (e: HammerInput) => (this._panData = e));
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

        // console.log(this._slideable, this._slideable.length);
        // Array.from(this._slideable).forEach((el: Element, i) => {
        //     // Updated this line to utilize deltaX.
        //     var x = deltaX;
        //     //var x = deltaX > 100 ? 100 : deltaX;
        //     // x = deltaX < -100 ? -100 : deltaX;

        //     //if (x <= 100 && x >= -100 && x != 0) {
        //     console.log("movedX");
        //     (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
        //     this.movedX = x;
        //     //}
        // });

        console.log("update", deltaX, isFinal);
        super.update(changedProperties);
    }

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            section {
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
            }

            th,
            td {
                /* background: #eee; */
                padding: 8px;
            }

            tr {
                transition: transform 0.35s ease-out;
                /*transition: all 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55);*/
                /* transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
                transition-duration: 0.9s; */
            }

            .rubberband {
                -webkit-animation-name: rubberBand;
                animation-name: rubberBand;
            }

            .tdDeleteRow {
                position: absolute;
                right: -100px;
                display: none;
                opacity: 0;
                visibility: hidden;
                transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
            }
            .tdDeleteRow[active] {
                visibility: visible;
                display: flex;
                opacity: 1;
            }

            button:hover {
                animation-name: rubberBand;
            }

            @keyframes rubberBand {
                from {
                    transform: scale3d(1, 1, 1);
                }

                30% {
                    transform: scale3d(1.25, 0.75, 1);
                }

                40% {
                    transform: scale3d(0.75, 1.25, 1);
                }

                50% {
                    transform: scale3d(1.15, 0.85, 1);
                }

                65% {
                    transform: scale3d(0.95, 1.05, 1);
                }

                75% {
                    transform: scale3d(1.05, 0.95, 1);
                }

                to {
                    transform: scale3d(1, 1, 1);
                }
            }

            @media screen and (max-width: 400px) {
                table {
                    width: 100%;
                }

                table thead {
                    display: none;
                }

                table tr,
                table td {
                    border-bottom: 1px solid #ddd;
                }

                table tr {
                    margin-bottom: 8px;
                }

                table td {
                    display: flex;
                }

                table td::before {
                    content: attr(label);
                    font-weight: bold;
                    /*width: 120px;
                    min-width: 120px;*/
                }
            }
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

        // After update is complete,
        //await this.updateComplete;
        //Array.from(this.items).forEach((el: Element, i) => {}
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

    private _slideRightHandler(e: Event, index: number) {
        const el = this.shadowRoot?.querySelectorAll("tr[role='row']");
        const target = e.detail.event;
        console.debug("_slideRightHandler, delta: ", target.deltaX);

        const x = target.deltaX;

        // Pan to the Right (for resetting)
        if (target.isFinal == true) {
            console.debug("isFinal", target.isFinal, x, index);
            (el[index] as HTMLElement).style.transform = `translate3d(0,0,0)`;
            // (el[index] as HTMLElement).style.transition = `all 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55);`;

            var deleteEl = this.shadowRoot?.querySelectorAll(".tdDeleteRow");
            deleteEl[index].removeAttribute("active");

            return;
        }

        (el[index] as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
    }

    private _slideTapHandler(_: Event, index: number) {
        const el = this.shadowRoot?.querySelectorAll("tr[role='row']");

        if (this.slideIsOpen && el != undefined) {
            // If slide is open, we can reset the slide
            (el[index] as HTMLElement).style.transform = `translate3d(0,0,0)`;
            this.slideIsOpen = false;
        }
    }

    private _slideLeftHandler(e: Event, index: Number) {
        // Slides a table row
        const el = this.shadowRoot?.querySelectorAll("tr[role='row']");
        const target = e.detail.event;
        console.debug("_slideLeftHandler, delta: ", target.deltaX);

        const x = target.deltaX;
        // Pan to the Left

        // Display hidden delete action
        var deleteEl = this.shadowRoot?.querySelectorAll(".tdDeleteRow");
        var att = document.createAttribute("active");
        deleteEl[index].setAttributeNode(att);

        if (target.isFinal == true) {
            console.debug("isFinal", target.isFinal, x);
            (el[index] as HTMLElement).style.transform = `translate3d(-100px,0,0)`;
            this.slideIsOpen = true;
            return;
        }

        (el[index] as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
    }

    private tableHeaderRenderer = () => {
        return html`
            <tr>
                <th>Item</th>
                <th>Amount</th>
                <th></th>
            </tr>
        `;
    };

    private trRenderer = (item: UserStockAlert, index: Number) => {
        return html`
            <tr
                role="row"
                index="${index}"
                class="lemon"
                @tap=${(e) => this._slideTapHandler(e, index)}
                @panleft=${(e) => this._slideLeftHandler(e, index)}
                @panright=${(e) => this._slideRightHandler(e, index)}
            >
                <td>
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                        <vaadin-vertical-layout id="vert-${item.uuid}" style="line-height: var(--lumo-line-height-m);" @swipe=${this.handleDrag}>
                            <span> ${item.title}</span>
                            <span style="font-size: var(--lumo-font-size-s); color: var(--lumo-secondary-text-color);"> ${truncate(item.notes, 140)} </span>
                            <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                <span style="font-size: var(--lumo-font-size-xxs); color: var(--lumo-secondary-text-color);">triggered 5 mins ago</span>
                            </vaadin-horizontal-layout>
                        </vaadin-vertical-layout>
                    </vaadin-horizontal-layout>
                    <vaadin-horizontal-layout style="align-items: center;" theme="spacing"> </vaadin-horizontal-layout>
                </td>
                <td>
                    <vaadin-horizontal-layout>
                        <paper-toggle-button ?checked=${!item.enabled}></paper-toggle-button>
                    </vaadin-horizontal-layout>
                </td>
                <td class="tdDeleteRow" style="align-items: center;" theme="spacing">
                    <vaadin-horizontal-layout>
                        <vaadin-button style="vertical-align: middle;"><vaadin-icon theme="error" icon="lumo:cross"></vaadin-icon></vaadin-button>
                    </vaadin-horizontal-layout>
                </td>
            </tr>
        `;
    };

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <table class="yld0" style="overflow:hidden;">
                    <!-- header -->
                    ${this.tableHeaderRenderer()}
                    <!-- data -->
                    ${this.items?.map((i, index) => this.trRenderer(i, index))}
                </table>
            </section>

            <button class="rubberband">sada</button>>
            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

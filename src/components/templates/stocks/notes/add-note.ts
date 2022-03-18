import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/icon";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";

import { themeStyles } from "../../../../themes/yld0-theme/styles.js";

import "../../../atoms/text-area/text-area";
import "../../../atoms/checkbox/check-box";

@customElement("add-note")
export class AddNote extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Object })
    startingPos?: Object; // absolute starting Position of the web component

    @property({ type: Object })
    stock?: Object;

    @property({ type: Boolean, reflect: true })
    open: boolean = false;

    @state()
    _open: boolean = false; // internal state used to handle add/remove event listeners correctly

    @state()
    sticky: boolean = false; // if true we expect to be allow to drag

    @state()
    disableSubmit: boolean = true;

    @state()
    includePrice: boolean = true;

    @state()
    notes: String = "";

    @state()
    expanded: boolean = false;

    @query("div.add-container")
    container;

    @query("div.add-container-wrapper")
    container_wrapper;

    @query("#iconPin")
    _pin;

    // -- End of properties, queries etc. -- //

    static styles = [
        utility,
        themeStyles,
        css`
            :host {
                display: none;
            }

            :host([open]) {
                display: inline-block;
            }

            .add-container-wrapper {
                position: absolute;
                display: inline-block;
                margin: 0.1rem;
                position: absolute;
                inset: 0px auto auto 0px;
                margin: 0px;
                background-color: var(--lumo-base-color);
                z-index: 100;
            }

            .add-container {
                min-width: 340px;
                min-height: 450px;
                width: 340px;
                height: 450px;
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
                margin-top: 0;
                padding-top: 0;
                margin-bottom: 0.3rem;
                padding-bottom: 0.3rem;
            }

            span.title {
                padding-right: 8px;
                margin-bottom: 0.2rem;
                color: var(--lumo-primary-text-color);
                font-size: var(--lumo-font-size-m);
                font-weight: 500;
            }

            .body {
                padding: 1rem;
                padding-top: 0rem;
            }

            footer {
                padding: 0.75rem 1.25rem;
                background-color: #f7f7f9;
                border-top: 1px solid rgba(0, 0, 0, 0.125);
                min-width: 100%;
                /* push footer to bottom */
                margin-top: auto;
                /* ensure width includes padding */
                box-sizing: border-box;
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
            }

            #iconPin[clicked] {
                color: white;
                background-color: var(--default-primary-color);
            }

            .dragBar {
                cursor: move;
                height: 30px;
                width: 100%;
                text-align: center;
                font-size: var(--lumo-font-size-micro);
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
        `,
    ];

    // -- Start of lifecycle methods -- //

    constructor() {
        super();
        this.onDocClick = this.onDocClick.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.addDocListener();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeDocListener();
    }

    protected firstUpdated() {
        // Set a starting position if property set
        if (this.startingPos?.clientX && this.startingPos?.clientY) {
            this.container_wrapper.style.top = this.startingPos.clientY + "px";
            this.container_wrapper.style.left = this.startingPos.clientX + "px";
        } else {
            this.container_wrapper.style.top = "230px";
            this.container_wrapper.style.left = "560px";
        }
    }

    update(changedProperties) {
        console.debug("add-note, update", "_open: ", this._open, "open: ", this.open);
        if (!this._open && this.open) {
            this.opened();
        }
        super.update(changedProperties);
    }

    // -- Functions -- //
    private onDocClick(event: Event) {
        console.debug("onDocClick, _open: ", this._open);
        if (this._open && !event.composedPath().includes(this)) {
            console.debug("add-note, closing");
            this.close();
        }
        this._open = this.open;
    }

    addDocListener() {
        console.log("addDocListener");
        this.setAttribute("listener", "true");
        document.addEventListener("click", this.onDocClick);
    }

    removeDocListener() {
        console.log("removeDocListener");
        this.removeAttribute("listener");
        document.removeEventListener("click", this.onDocClick);
    }

    opened() {
        if (this.getAttribute("listener") == null) {
            this.addDocListener();
        }
    }

    close() {
        this._open = false;
        this.open = false;
        this.removeDocListener();
    }

    handleExpandShrink() {
        if (this.expanded) {
            this.container.classList.remove("scaled");
            this.expanded = !this.expanded;
        } else {
            this.container.classList.add("scaled");
            this.expanded = !this.expanded;
        }
    }

    handleSave() {
        var event = new CustomEvent("save", { detail: { notes: this.notes, includePrice: this.includePrice } });
        this.dispatchEvent(event);
    }

    validate() {
        this.disableSubmit = this.notes ? false : true;
    }

    /* Support for sticky drag */

    closeDragElement() {
        /* stop moving when mouse button is released: */
        document.onmouseup = null;
        document.onmousemove = null;
    }

    handleDrag(event: Event) {
        event = event || window.event;
        document.onmouseup = this.closeDragElement;
        document.onmousemove = this.elementDrag.bind(this);
    }

    elementDrag(event: Event) {
        console.log("elementDrag", event);
        event = event || window.event;

        var rect = this.container.getBoundingClientRect();
        this.container_wrapper.style.top = event.clientY - 10 + "px"; // + 100 + "px"; //"-250px";
        this.container_wrapper.style.left = event.clientX - rect.width / 2 + "px";

        event.stopImmediatePropagation();
        // stops bubbling the tap event to its parents. so you can create nested events.
        event.stopPropagation();

        // prevents the browser from doing it's native 'tap' implementation.
        // doesnt make any sense, only for the drag events, since most browsers
        // support dragstart-drag-dragend
        // it is in hammer, because document.createEvent adds these, and Hammer uses
        // this for creating DOM events.
        event.preventDefault();

        // stops the source event (in event.gesture.srcEvent) from bubbling.
        // the source event could be touchstart, touchmove, mousemove etc.
        event.gesture?.stopPropagation();

        // prevents the source event (in event.gesture.srcEvent) from doing it's native behavior.
        // when you use this, you can make the element blocking,
        // because touchstart-touchmove let the browser scroll
        // if you dont prevent the default action. this could be called when you are
        // using the drag and transform events,
        // but hammer does this for you in most cases
        event.gesture?.preventDefault();
    }

    handleTogglePin(event: Event) {
        console.log(this._pin.getAttribute("clicked"));
        if (this._pin.getAttribute("clicked")) {
            this._pin.removeAttribute("clicked");
            this.sticky = false;
            this.addDocListener();
        } else {
            this._pin.setAttribute("clicked", "true");
            this.sticky = true;
            this.removeDocListener();
            event.stopImmediatePropagation();
            event.stopPropagation();
        }
    }

    /* End of Support for sticky drag */

    // -- Main Render -- //
    render() {
        this.validate();

        return html`
            <div class="add-container-wrapper">
                <div class="add-container">
                    <div class="dragBar" @mousedown="${this.handleDrag}"></div>
                    <header>
                        <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                            <span class="description">Add note</span>
                            <vaadin-vertical-layout style="margin-left: auto;">
                                <span style="margin-left: auto;" class="description">${this.stock?.symbol}</span>
                                <span class="description">Current Price: ${this.stock?.price}</span>
                            </vaadin-vertical-layout>
                            <vaadin-button id="iconPin" @click=${this.handleTogglePin} theme="icon" aria-label="pin">
                                <vaadin-icon icon="vaadin:pin"></vaadin-icon>
                            </vaadin-button>
                            <vaadin-button id="expandShrink" @click=${this.handleExpandShrink} theme="icon" aria-label="Expand width">
                                <vaadin-icon icon="${this.expanded ? "vaadin:compress" : "vaadin:expand"}"></vaadin-icon>
                            </vaadin-button>
                        </vaadin-horizontal-layout>
                    </header>
                    <div class="body">
                        <check-box
                            label="Save current price along with the note."
                            @checked=${(e) => {
                                this.includePrice = e.detail;
                            }}
                        ></check-box>
                        <text-area
                            theme="no-border no-focus-border long no-margin"
                            label="Notes"
                            placeholder="Add your notes"
                            @on-change=${(e) => {
                                this.notes = e.detail.value;
                            }}
                        ></text-area>
                        <slot></slot>
                    </div>
                    <footer>
                        <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                            <vaadin-button
                                theme="small"
                                style="margin-left: 10px;"
                                @click=${() => {
                                    this.close();
                                }}
                                >Cancel</vaadin-button
                            >
                            <vaadin-button style="margin-left: auto;" ?disabled=${this.disableSubmit} theme="small" @click=${this.handleSave}>Save</vaadin-button>
                        </vaadin-horizontal-layout>
                    </footer>
                </div>
            </div>
        `;
    }
}

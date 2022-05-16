/* Full Page Modal */
import { LitElement, html, css } from "lit";
import { customElement, state, property, query } from "lit/decorators.js";

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
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { HammerController } from "../../controllers/hammer-controller";
import { formatRFC3339WithOptions } from "date-fns/fp";

/**
 * `<yld0-tabs>` is a Web Component for easy switching between different views.
 *
 * ```
 *   <yld0-tabs selected="4">
 *     <yld0-tab title="Page 1">Page 1 Content</vaadin-tab>
 *     <yld0-tab title="Page 2">Page 2 Content</vaadin-tab>
 *     <yld0-tab title="Page 3">Page 3 Content</vaadin-tab>
 *     <yld0-tab title="Page 4">Page 4 Content</vaadin-tab>
 *   </yld0-tabs>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|--------------------------------------
 * `back-button`     | Button for moving the scroll back
 * `tabs`            | The tabs container
 * `forward-button`  | Button for moving the scroll forward
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `orientation` | Tabs disposition, valid values are `horizontal` and `vertical`. | :host
 * `overflow` | It's set to `start`, `end`, none or both. | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 *
 */
@customElement("yld0-tabs")
class YLD0Tabs extends LitElement {
    /* Properties, states, mixins etc. */

    @state()
    isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

    // Reactive controller for hammer gestures
    private _ = new HammerController(this, { panleft: {}, panright: {} }, { panleft: { selectors: ["#progress"] }, panright: { selectors: [".lemon"] }, tap: { selectors: [".lemon"] }, options: {} });

    @property({ type: Number, reflect: true })
    index: number = 0;

    @property({ type: String, reflect: true })
    orientation: string = "horizontal";

    @property({ type: Number, reflect: true })
    selected: Number = 0;

    @query("#lemon")
    lemon;

    /* End of properties, states ... */

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            :host {
                display: block;
                position: relative;
                align-items: center;
                width: 100%;
                height: 100%;
            }
            ::slotted(*) {
                position: absolute;
                width: 100%;
                height: 100%;
                transition: transform 0.35s ease-out;
            }

            :host([hidden]) {
                display: none !important;
            }

            :host([orientation="vertical"]) {
                display: block;
            }

            :host([orientation="horizontal"]) [part="tabs"] {
                flex-grow: 1;
                display: flex;
                align-self: stretch;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
            }

            /* This seems more future-proof than \`overflow: -moz-scrollbars-none\` which is marked obsolete
         and is no longer guaranteed to work:
         https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#Mozilla_Extensions */
            @-moz-document url-prefix() {
                :host([orientation="horizontal"]) [part="tabs"] {
                    overflow: hidden;
                }
            }

            :host([orientation="horizontal"]) [part="tabs"]::-webkit-scrollbar {
                display: none;
            }

            :host([orientation="vertical"]) [part="tabs"] {
                height: 100%;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            #slider {
                display: flex;
                height: 3px;
                width: var(--lumo-size-s);
                background-color: green;
                position: absolute;
                display: var(--_lumo-tab-marker-display, block);
                bottom: 0;
                left: 0%;
                align-items: center;
                border-radius: 99px; // just a high number to create pill effect
                transition: 0.25s ease-out;
            }

            /* #slider::before,
            #slider::after {
                content: "";
                color: green;
                position: absolute;
                display: var(--_lumo-tab-marker-display, block);
                bottom: 0;
                left: 50%;
                width: var(--lumo-size-s);
                height: 5px;
                background-color: var(--lumo-contrast-60pct);
                border-radius: var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0 0;
                transform: translateX(-50%) scale(0);
                transform-origin: 50% 100%;
                transition: 0.14s transform cubic-bezier(0.12, 0.32, 0.54, 1);
                will-change: transform;
            } */

            /* svg {
                position: absolute;
                top: calc(50% - 25px);
                height: 50px;
                cursor: pointer;
            }
            #next {
                right: 0;
            }
            #progress {
                position: relative;
                top: calc(100% - 20px);
                height: 20px;
                width: 50%;
                margin: 0 auto;
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: 1fr;
                grid-gap: 10px;
                align-content: center;
            }
            #progress > div {
                background: grey;
                height: 4px;
                transition: background 0.3s linear;
                cursor: pointer;
            }
            #progress > div.watched {
                background: white;
            } */
        `,
    ];

    constructor() {
        super();

        this.addEventListener("click", (e: Event) => this._onClick(e));

        if (this.isMobile) {
            this.addEventListener("panleft", (e: Event) => {
                this._slideLeftHandler(e);
            });

            this.srh = (e: Event) => {
                this._slideRightHandler(e);
            };

            this.addEventListener("panright", this.srh);
        }

        // set orientation for tab items
        this.setAttribute("orientation", this.orientation);
        this.setAttribute("aria-orientation", this.orientation);

        // Set index on children, which can be used as a reference for progammatically switching tabs
        Array.from(this.children).forEach((el: Element, i) => {
            el.setAttribute("index", i);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("panright", this.srh);
    }

    protected firstUpdated() {
        // Set initial state where possible ...

        console.log("nuno firstUpdated, ", this.id, this.index);

        Array.from(this.children).forEach((el: Element, i) => {
            const x = (i - this.index) * this.clientWidth;
            console.log("nuno constructor ", "i", i, x);
            if (i > 0) {
                (el as HTMLElement).style.visibility = "hidden";
                (el as HTMLElement).style.display = "none";
            }

            (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;

            // Set index on children, which can be used as a reference for progammatically switching tabs
            //el.setAttribute("index", i);
        });

        console.log("nuno yld0-tabs firstupdated");
        this.syncSelected();

        // const item = this.shadowRoot?.querySelectorAll("yld0-tabitem")[this.index];
        // let idx;
        // if (item && !item.disabled && (idx = Array.from(this.shadowRoot?.querySelectorAll("yld0-tabitem")).indexOf(item)) >= 0) {
        //     this.index = idx;
        //     item.setAttribute("selected", "");
        //     //this.lemon.scrollLeft = 1400;
        //     this.syncSlide(0);
        // }
    }

    /* Advance to the next tab if possible */
    next() {
        this.index = Math.max(0, Math.min(this.children.length - 1, this.index + 1));
    }

    /* Advance to the previous tab if possible */
    previous() {
        this.index = Math.max(0, Math.min(this.children.length - 1, this.index - 1));
    }

    private _slideLeftHandler(e: Event) {
        console.debug("_slideLeftHandler", e);
        const target = e.detail.event;
        const isFinal = target.isFinal;
        var deltaX = target.deltaX;

        const width = this.clientWidth;
        const minScale = 0.8;

        //deltaX = isFinal ? 0 : deltaX;

        if (isFinal && Math.abs(deltaX) >= width / 2) {
            this.next();
            console.log("isFinal detected, this.next() called.");
            // We don't want the latent deltaX when releasing a pan.
            deltaX = 0;
        } else if (isFinal && Math.abs(deltaX) < width / 2) {
            // We don't want the latent deltaX when releasing a pan.
            deltaX = 0;
            console.log("isFinal detected, setting deltaX to 0 because not great enough.");
        }

        console.debug("deltaX", deltaX, "isFinal: ", isFinal, "width: ", width, "this.index: ", this.index);
        Array.from(this.children).forEach((el: Element, i) => {
            // If first time called need to make visible the other children

            (el as HTMLElement).style.visibility = "visible";
            (el as HTMLElement).style.display = "block";

            // For the 2nd child, will be translated to be off screen
            // so can be panned in.
            const x = (i - this.index) * width + deltaX;

            console.debug("i: ", i, "x: ", x);

            (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
        });

        // const selectedtab = this.shadowRoot?.querySelector("#slider");
        // const lemon = Math.abs(deltaX / self.clientWidth) * 75;
        // // const selectedTabWidth = selectedtab.clientWidth / 10;
        // // const x = Math.abs(this.index * selectedTabWidth + deltaX / 10);
        // console.warn("lemon", lemon, this.clientWidth);
        // (selectedtab as HTMLElement).style.transform = `translate3d(${lemon}px,0,0)`;

        // Hide other children so no bleeding in the edges
        // Lazy way to wait for css slide out transition
        setTimeout(() => {
            Array.from(this.children).forEach((el: Element, i) => {
                if (i != this.index) {
                    (el as HTMLElement).style.visibility = "hidden";
                    (el as HTMLElement).style.display = "none";
                }
            });
        }, 500);
    }

    private _slideRightHandler(e: Event) {
        // Move back in tabs
        console.debug("_slideRightHandler", e);
        const target = e.detail.event;
        const isFinal = target.isFinal;
        var deltaX = target.deltaX;

        const width = this.clientWidth;

        if (isFinal && Math.abs(deltaX) >= width / 2) {
            this.previous();
            console.log("isFinal detected, this.previous() called.");
            // We don't want the latent deltaX when releasing a pan.
            deltaX = 0;
        } else if (isFinal && Math.abs(deltaX) < width / 2) {
            // We don't want the latent deltaX when releasing a pan.
            deltaX = 0;
            console.log("isFinal detected, setting deltaX to 0 because not great enough.");
        }

        if (isFinal == true) {
            this.previous();
            console.log("isFinal detected, this.previous() called.");
        }

        console.debug("deltaX", deltaX, "isFinal: ", isFinal, "width: ", width, "this.index: ", this.index);
        Array.from(this.children).forEach((el: Element, i) => {
            // If first time called need to make visible the other children

            (el as HTMLElement).style.visibility = "visible";
            (el as HTMLElement).style.display = "block";

            // For the 2nd child, will be translated to be off screen
            // so can be panned in.
            const x = (i - this.index) * width + deltaX;

            console.debug("i: ", i, "x: ", x);

            (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
        });

        // Hide other children so no bleeding in the edges
        // Lazy way to wait for css slide out transition
        setTimeout(() => {
            Array.from(this.children).forEach((el: Element, i) => {
                if (i != this.index) {
                    (el as HTMLElement).style.visibility = "hidden";
                    (el as HTMLElement).style.display = "none";
                }
            });
        }, 500);
    }

    private syncSlide(deltaX) {
        const width = this.clientWidth;

        Array.from(this.children).forEach((el: Element, i) => {
            // Make connected tabs visible but not unnecessary children
            if (i <= this.index) {
                (el as HTMLElement).style.visibility = "visible";
                (el as HTMLElement).style.display = "block";
            }

            // For the 2nd child, will be translated to be off screen
            // so can be panned in.
            const x = (i - this.index) * width + deltaX;

            console.debug("i: ", i, "x: ", x);

            (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
        });

        // Hide other children so no bleeding in the edges
        // Sloppy way to wait for css slide out transition
        setTimeout(() => {
            Array.from(this.children).forEach((el: Element, i) => {
                if (i != this.index) {
                    (el as HTMLElement).style.visibility = "hidden";
                    (el as HTMLElement).style.display = "none";
                }
            });
        }, 500);
    }

    private syncSelected() {
        this.selected = this.index;

        let sl = 0;
        Array.from(this.shadowRoot?.querySelectorAll("yld0-tabitem")).forEach((el: Element, i) => {
            if (i == this.index) {
                console.log("nuno yld0-tabs", i, sl);
                el.setAttribute("selected", "");
                this.lemon.scrollLeft = sl;
            } else {
                el.removeAttribute("selected");
            }
            // Calculate the scroll width
            sl += el.clientWidth;
            console.log("nuno", i, el.clientWidth, el.offsetWidth, el.width, el.scrollWidth);
        });

        this.syncSlide(0);
    }

    private _filterItems(array) {
        return array.filter((e) => e.nodeName == "YLD0-TABITEM");
    }

    private _onClick(event: Event) {
        // Set tab selection

        if (event.metaKey || event.shiftKey || event.ctrlKey || event.defaultPrevented) {
            return;
        }

        const item = this._filterItems(event.composedPath())[0];
        let idx;
        if (item && !item.disabled && (idx = Array.from(this.shadowRoot?.querySelectorAll("yld0-tabitem")).indexOf(item)) >= 0) {
            this.index = idx;
            item.setAttribute("selected", "");
            this.syncSlide(0);
        }
    }

    update(changedProperties: PropertyValues) {
        // We use a reflected property 'selected' which is the same as the index
        console.log("yld0-tabs update");

        var syncNeeded = false;
        if (this.selected != this.index) {
            syncNeeded = true;
        }

        // this.selected needs to mirror this.index
        this.syncSelected();

        // if (syncNeeded) {
        //     this.syncSlide(0);
        // }

        // console.log("danvir update -- check - remove", this.lemon);
        // if (this.lemon) {
        //     this.lemon.scrollLeft = this.index * 128;
        // }

        super.update(changedProperties);
    }

    render() {
        return html`
            <div id="lemon" part="tabs" class="yld0Tabs">${Array.from(this.children).map((child, i) => html` <yld0-tabitem>${child.getAttribute("title")}</yld0-tabitem>`)}</div>

            <slot></slot>

            <div id="progress">${Array.from(this.children).map((_, i) => html` <div @panleft=${(e) => this._slideLeftHandler(e)}></div>`)}</div>
        `;
    }
}

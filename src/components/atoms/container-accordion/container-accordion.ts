import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

@customElement("container-accordion")
export class ContainerAccordion extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Object, reflect: false })
    boundaryElement: Object; // a node Element which defines where an accordion should collapses

    @property({ type: Boolean, reflect: true })
    open: boolean = false;

    @state()
    _open: boolean = false; // internal state used to handle add/remove event listeners correctly

    @property({ type: Number })
    height = 200;

    @query(".container-wrapper")
    _wrapper: Element;

    @query(".container")
    _container: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            :host {
                font-family: var(--lumo-font-family);
                font-weight: 200;
                font-size: var(--lumo-font-size-xs);
                color: var(--_lumo-button-color, var(--lumo-primary-text-color));
            }

            .container-wrapper {
                display: inline-block;
                margin: 0.1rem;
                overflow: hidden;

                -webkit-transition: height 1s ease-in-out, padding-left 1s ease-in-out, padding-right 1s ease-in-out;
                -moz-transition: height 1s ease-in-out, padding-left 1s ease-in-out, padding-right 1s ease-in-out;
                -o-transition: height 1s ease-in-out, padding-left 1s ease-in-out, padding-right 1s ease-in-out;
                transition: height 1s ease-in-out, padding-left 1s ease-in-out, padding-right 1s ease-in-out;
            }

            .container {
                /* min-height: 450px; */
                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);

                height: 2px;
                padding: 1rem;

                -webkit-transition: height 1.1s ease-in-out, padding-left 1.1s ease-in-out, padding-right 1.1s ease-in-out;
                -moz-transition: height 1.1s ease-in-out, padding-left 1.1s ease-in-out, padding-right 1.1s ease-in-out;
                -o-transition: height 1.1s ease-in-out, padding-left 1.1s ease-in-out, padding-right 1.1s ease-in-out;
                transition: height 1.1s ease-in-out, padding-left 1.1s ease-in-out, padding-right 1.1s ease-in-out;

                /* 
                display: flex;
                flex-direction: column;

                -webkit-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -moz-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -o-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out; */
            }
        `,
    ];

    // -- Lifecycle function -- //

    constructor() {
        super();
        this.onDocClick = this.onDocClick.bind(this);
    }

    firstUpdated() {
        if (this._wrapper) {
            this._wrapper.style.height = `0px`;
            this._container.style.height = `0px`;
        }
        this.onDocClick = this.onDocClick.bind(this);
    }

    update(changedProperties) {
        console.log("update, ", this._open, this.open);

        if (!this._open && this.open) {
            this.opened();
        }
        if (this.open) {
            if (this._wrapper) {
                this._wrapper.style.height = `${this.height + 50}px`;
                this._container.style.height = `${this.height}px`;
            }
        } else {
            if (this._wrapper) {
                this._wrapper.style.height = `0px`;
                this._container.style.height = `0px`;
            }
        }

        super.update(changedProperties);
    }

    // -- Other functions -- //

    addDocListener() {
        this.setAttribute("listener", "true");
        document.addEventListener("click", this.onDocClick);
    }

    removeDocListener() {
        this.removeAttribute("listener");
        document.removeEventListener("click", this.onDocClick);
    }

    private onDocClick(event: Event) {
        console.log("onDocClick, ", event.composedPath().includes(this), event.composedPath(), this);
        const path = this.boundaryElement;
        console.log("path,", path);
        if (this._open && !event.composedPath().includes(path)) {
            this.close();
        }
        this._open = this.open;
    }

    opened() {
        if (this.getAttribute("listener") == null) {
            this.addDocListener();
        }
    }

    close() {
        var event = new CustomEvent("close", { detail: {} });
        this.dispatchEvent(event);
        this._open = false;
        this.open = false;
        this.removeDocListener();
    }

    // -- Main Render -- //
    render() {
        return html`
            <div class="container-wrapper">
                <div class="container">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

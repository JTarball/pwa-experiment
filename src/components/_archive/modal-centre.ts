/* Full Page Modal */
import { LitElement, html, css } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";

import { animated } from "../../themes/yld0-theme/components/animated.js";
import { fadeInLeft } from "../../themes/yld0-theme/components/fade.js";
import { slideUp } from "../../themes/yld0-theme/components/slide.js";

@customElement("modal-centre")
class ModalCentre extends LitElement {
    @property()
    private visible: Boolean = false;

    @property()
    private title: String;

    @query(".wrapper")
    private _wrapper: Element;

    static styles = [
        badge,
        utility,
        spacing,
        animated,
        slideUp,
        fadeInLeft,
        themeStyles,
        css`
            .wrapper {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: gray;
                opacity: 0;
                visibility: hidden;
                transform: scale(1.1);
                transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
                z-index: 100;
            }
            .modal {
                background-color: #fefefe;
                margin: auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
            }
            .visible {
                visibility: visible;
                opacity: 1;
            }
        `,
    ];

    private _handleCancel() {
        this._wrapper.removeAttribute("visible");
    }

    render() {
        const wrapper = this.visible ? "slideUp wrapper visible" : "wrapper";
        return html`
            <div class="${wrapper}">
                <div class=" modal">
                    <header class="bg-base border-b border-contrast-10 box-border flex h-xl items-center w-full" slot="navbar">
                        <vaadin-vertical-layout class="m-auto" style="line-height: var(--lumo-line-height-m);">
                            <span id="title">${this.title}</span>
                        </vaadin-vertical-layout>
                    </header>
                    asdadsaasdada
                    <div class="content">
                        <slot></slot>
                    </div>
                    <div class="button-container">
                        <button class="cancel">Cancel</button>
                        <button class="ok">Okay</button>
                    </div>
                </div>
            </div>
        `;
    }
}

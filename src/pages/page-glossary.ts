import { html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { PageElement } from "../helpers/page-element.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";

import "../components/organisms/top-navbar/top-navbar";
import "../components/templates/bottom-navbar";

@customElement("page-glossary")
export class PageGlossary extends PageElement {
    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            section {
                padding: 0.5rem;
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
                padding-bottom: 1rem;
            }

            /* Medium Devices, Desktops */
            @media only screen and (min-width: 992px) {
                section {
                    max-width: 768px;
                    margin-left: auto;
                    margin-right: auto;
                    padding: 2rem;
                }
            }

            .help {
                margin-left: auto;
            }
        `,
    ];

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}" searchEnabled @searchopen-changed=${this.handleModalOpen}></top-navbar>

            <!-- The main content is added / removed dynamically by the router -->
            <section>
                <h1>About</h1>

                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, delectus? Unde, sit. Fuga modi ea praesentium. Nemo dicta qui, magnam cum dolorum excepturi beatae explicabo
                    quidem fugiat ullam blanditiis minima!
                </p>
            </section>

            <!-- slot, just in case -->
            <slot></slot>

            <!-- page modal -->
            <page-modal .title="${this.modalTitle}" ?open="${this.modalOpen}" @closed="${this.lemon}"> ${this.modalRenderer}</page-modal>

            <!-- The bottom tabs -->
            <bottom-navbar .location=${this.location}></bottom-navbar>
        `;
    }

    meta() {
        return {
            title: "About",
            description: "About page description",
        };
    }
}

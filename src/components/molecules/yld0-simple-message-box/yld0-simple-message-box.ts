/* Full Page Modal */
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@vaadin/button";

import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { themeStyles } from "../../../themes/yld0-theme/styles.js";

@customElement("yld0-simple-message-box")
class YLD0SimpleMessageBox extends LitElement {
    /* Properties, states, mixins etc. */

    @property({ type: Boolean }) loaded = false;

    @property()
    boxTitle: string = "";

    @property()
    boxSubtitle: string = "";

    @property()
    boxImg: string = "";

    @property()
    help: string = "";

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            :host ::slotted {
                margin-right: auto;
                margin-left: auto;
            }

            .center {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            section {
                margin-right: auto;
                margin-left: auto;
                border-radius: 10px;
                border: 1px solid var(--lumo-contrast-10pct);
                padding: 1rem;
                padding-top: 1rem;

                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
                min-width: 250px;
                min-height: 250px;
            }
            h1 {
                text-align: center;
            }

            p {
                text-align: center;
                color: var(--lumo-secondary-text-color);
                display: block;
                margin-block-start: 1em;
                margin-block-end: 1em;
                margin-inline-start: 0px;
                margin-inline-end: 0px;
                margin-bottom: 2em;
                max-width: 90%;
                margin-left: auto;
                margin-right: auto;
            }

            p.help {
                text-align: center;
                text-align: center;
                font-size: var(--lumo-font-size-tiny);
                line-height: var(--lumo-line-height-s);
                color: var(--lumo-secondary-text-color);
                margin-left: auto;
                margin-right: auto;
                margin-top: 3em;
                margin-bottom: 0.75em;
                max-width: 80%;
            }

            #imgLoad {
                display: block;
                margin: auto;
                margin-top: 20px;
                animation: spinCircle 20s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            }

            #imgLoaded {
                display: block;
                margin: auto;
                margin-top: 20px;
                animation-name: elasticExpand;
                animation-duration: 3s;
            }

            @keyframes spinCircle {
                0%,
                100% {
                    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
                }
                0% {
                    transform: rotateY(0deg);
                }
                50% {
                    transform: rotateY(900deg);
                    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
                }
                100% {
                    transform: rotateY(1800deg);
                }
            }

            @keyframes elasticExpand {
                0% {
                    -moz-transform: scale(0.7);
                    -ms-transform: scale(0.7);
                    -o-transform: scale(0.7);
                    -webkit-transform: scale(0.7);
                    transform: scale(0.7);
                }
                50% {
                    -moz-transform: scale(1.1);
                    -ms-transform: scale(1.1);
                    -o-transform: scale(1.1);
                    -webkit-transform: scale(1.1);
                    transform: scale(1.1);
                }
                90% {
                    -moz-transform: scale(1.01);
                    -ms-transform: scale(1.01);
                    -o-transform: scale(1.01);
                    -webkit-transform: scale(1.01);
                    transform: scale(1.01);
                }
                100% {
                    -moz-transform: scale(1);
                    -ms-transform: scale(1);
                    -o-transform: scale(1);
                    -webkit-transform: scale(1);
                    transform: scale(1);
                }
            }
        `,
    ];

    render() {
        return html`
            <section>
                <img src="images/yld0-title.svg" alt="yld0" style="width:50px;" />

                ${this.loaded
                    ? html`
                          ${this.boxImg
                              ? html`
                                    <div class="center">
                                        <img id="imgLoaded" src="${this.boxImg}" />
                                    </div>
                                `
                              : html``}
                          <div>
                              <h1>${this.boxTitle}</h1>
                              <p>${this.boxSubtitle}</p>
                          </div>
                          <div class="center">
                              <slot></slot>
                          </div>

                          ${this.help ? html`<p class="help">${this.help}</p>` : html``}
                      `
                    : html`
                          <div class="center">
                              <img id="imgLoad" src="/images/loading.svg" />
                          </div>
                      `}
            </section>
        `;
    }
}

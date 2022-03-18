import { LitElement, html, css } from "lit";
import { customElement, query, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";

@customElement("generic-alert")
class GenericAlert extends LitElement {
    // -- Start of state, properties, queries -- //

    @property()
    title: String = "";

    @property()
    description: String = "";

    @property({ type: String })
    theme: String = "";

    @query(".wrapper")
    _wrapper: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .wrapper {
                margin-top: 0.8rem;
                margin-left: 0.1rem;
                margin-right: 0.1rem;
                padding: 0.1rem;
                padding-bottom: 0;
            }

            :host ::slotted(p) {
                font-size: var(--lumo-font-size-xxs);
            }

            vaadin-button {
                background-color: var(--lumo-contrast-10pct);
            }

            .alert {
                text-align: center;
                position: relative;
                padding: 1rem 1rem;
                margin-bottom: 0rem;
                padding-bottom: 0.4rem;
                border: 1px solid transparent;
                border-radius: 0.25rem;
                max-width: 500px;
                margin-left: auto;
                margin-right: auto;
            }

            .alert-description {
                padding-left: 0.3rem;
                font-size: var(--lumo-font-size-xxs);
            }

            .alert-info {
                color: #084298;
                background-color: #cfe2ff;
                border-color: #b6d4fe;
                padding-bottom: 1rem;
                padding-left: 0.2rem;
                padding-right: 0.2rem;
            }

            .alert-warning {
                color: #664d03;
                background-color: #fff3cd;
                border-color: #ffecb5;
            }

            .alert-success {
                color: #0f5132;
                background-color: #d1e7dd;
                border-color: #badbcc;
            }

            .alert-dismissible {
                padding-right: 1rem;
            }

            .fade {
                transition: opacity 0.15s linear;
            }

            .closing {
                visibility: hidden;
                opacity: 0;
                transition: visibility 0s 0.25s, opacity 0.25s linear;
            }

            .closed {
                display: none;
            }

            #close {
                text-align: center;
                padding-top: 0.2rem;
            }

            #close-info {
                display: inline-block;
                padding-left: 0.2rem;
            }
        `,
    ];

    // -- Lifecycle function -- //

    // -- Other Renders -- //

    // -- Main Render -- //
    render() {
        let theme = this.theme;

        const classes = { alert: true, "alert-info": this.theme == "info", "alert-warning": this.theme == "", "alert-dismissible": true, fade: true, show: true };

        return html`
            <div class="wrapper">
                <div class="${classMap(classes)}" role="alert">
                    <strong>${this.title}</strong>
                    <span class="alert-description"> ${this.description} </span>
                    <slot></slot>

                    ${
                        this.theme == "info"
                            ? html``
                            : html`
                                  <div id="close">
                                      <vaadin-button
                                          @click=${() => {
                                              this._wrapper.classList.add("closing");

                                              // Lazy way to wait for css slide out transition
                                              setTimeout(() => {
                                                  const closed = new CustomEvent("closed", {
                                                      detail: {
                                                          value: false,
                                                      },
                                                  });
                                                  this.dispatchEvent(closed);
                                                  this._wrapper.classList.add("closed");
                                                  this._wrapper.classList.remove("closing");
                                              }, 200);
                                          }}
                                          theme="small"
                                          aria-label="Close"
                                      >
                                          Ok, got it
                                      </vaadin-button>
                                  </div>
                              `
                    }

  
                    </div>
                </div>
            </div>
        `;
    }
}

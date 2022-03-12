import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/horizontal-layout";

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

/**
 * Generic container card to show one-time information
 *
 * @param  {string}    uniqId    -  Required property: unique identifier used as a key for local storage
 *
 */
@customElement("container-card-info")
export class ContainerCardInfo extends LitElement {
    @property({ type: String })
    uniqId?: String;

    @state()
    gotIt: boolean = false;

    static styles = [
        css`
            .container-card {
                margin: 1rem;
                width: 250px;
                border-width: 1px;
                border-style: solid;
                border-image: initial;
                border-color: var(--lumo-contrast-10pct);
                display: flex;
                flex-direction: column;
                padding: 1.2rem;
                border-radius: 4px;
            }

            #gotIt {
                cursor: pointer;
                margin-left: auto;
                margin-right: auto;
                background-color: var(--lumo-shade-30pct); /* --lumo-shade-30pct */
            }
        `,
    ];

    // -- Lifecycle function -- //

    firstUpdated() {
        this.gotIt = JSON.parse(window.localStorage.getItem("yld0.card-info." + this.uniqId));
    }

    // -- Functions -- //
    validateAllProps() {
        assert(this.uniqId != undefined, "uniqId is a required property");
    }

    handleGotIt() {
        window.localStorage.setItem("yld0.card-info." + this.uniqId, "true");
        this.gotIt = true;
    }

    // -- Main Render -- //
    render() {
        this.validateAllProps();

        return html`
            ${this.gotIt
                ? html``
                : html`
                      <div class="container-card">
                          <slot></slot>
                          <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                              <vaadin-button id="gotIt" @click="${this.handleGotIt}" theme="primary contrast">Got it</vaadin-button>
                          </vaadin-horizontal-layout>
                      </div>
                  `}
        `;
    }
}

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { TimeLine } from "../../store/models.js";
import { themeStyles } from "../../themes/yld0-theme/styles.js";

@customElement("timeline-detail")
class TimelineDetail extends LitElement {
    @property()
    private item?: TimeLine;

    static styles = [
        badge,
        utility,
        themeStyles,
        css`
            /* handle the light / dark mode */
            /* :host:not([dark]) {
                  --bk-color: #eee;
              }
              :host([dark]) {
                  color: red;
              } */
            .header {
                width: auto;
                background: #eee;
            }
            h4 {
                padding: var(--lumo-space-s);
                margin: 0;
            }

            #description {
                font-size: var(--lumo-font-size-xxs);
            }
            .item {
                padding: 10px;
            }
        `,
    ];

    render() {
        return html`
            <div class="item">
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                    <vaadin-avatar img="${this.item?.pictureUrl}" name="${this.item?.title}" alt="User avatar"></vaadin-avatar>
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <span> ${this.item?.title}</span>
                        <div id="description">${this.item?.description}</div>
                    </vaadin-vertical-layout>
                    ${this.item?.mood ? html`<vaadin-icon id="mood" icon="${this.item?.mood ? "lumo:arrow-up" : "lumo-arrow-down"}" theme="badge contrast primary pill small"></vaadin-icon>` : html``}
                </vaadin-horizontal-layout>
            </div>
        `;
    }
}

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { TimeLine } from "../../store/models.js";

import "./timeline-detail";

@customElement("timeline-list")
class TimelineList extends LitElement {
    @property()
    private items?: TimeLine[];

    @state()
    private itemsYesterday?: TimeLine[];

    async firstUpdated() {
        this.itemsYesterday = this.items?.filter((item) => item.timeAgo == "Yesterday");
    }

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
            ul {
                margin: 0;
                padding: 0;
                /* padding-left: var(--lumo-space-xs);
                padding-right: var(--lumo-space-xs);
                padding-top: var(--lumo-space-s);
                padding-bottom: var(--lumo-space-s); */
            }
            .header {
                width: auto;
                background: #eee;
            }
            h4 {
                padding: var(--lumo-space-s);
                margin: 0;
            }
        `,
    ];

    render() {
        return html`
            <ul>
                <div class="header"><h4>Recent</h4></div>
                ${this.itemsYesterday?.map((i) => html`<li><timeline-detail .item=${i}></timeline-detail></li>`)}
                ${this.items?.map((i) => html`<li><timeline-detail .item=${i}></timeline-detail></li>`)}
            </ul>
        `;
    }
}

/* Full Page Modal */
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import "./yld0-tabitem.js";

@customElement("yld0-tab")
class YLD0Tab extends LitElement {
    /* Properties, states, mixins etc. */

    /* End of properties, states ... */

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            /* #media {
                height: 200px;
            }
            #media ::slotted(*) {
                width: 200px;
                height: 200px;
                object-fit: cover;
            } */

            /* Default styles for content */
            /* #yld0-item {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            } */

            #content {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            #content > slot::slotted(*) {
                margin: 0;
            }
        `,
    ];

    render() {
        return html`
            <!-- <yld0-tabitem>Legend</yld0-tabitem> -->
            <div id="content"><slot></slot></div>
        `;
    }
}

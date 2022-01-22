import { LitElement, html, css, render } from "lit";
import { customElement, property } from "lit/decorators.js";
import { guard } from "lit/directives/guard.js";

import "@vaadin/horizontal-layout";
import { NotificationRenderer, NotificationOpenedChangedEvent } from "@vaadin/notification";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";

// Generic notification for yld0
@customElement("generic-notification")
class Notification extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: Boolean, reflect: true })
    opened: boolean = false;

    @property()
    text: String;

    // -- End of properties, queries etc. -- //

    static styles = [badge, utility, spacing, themeStyles, css``];

    // -- Other Renderers -- //
    // notificationRenderer: NotificationRenderer = (root) => {
    //     render(
    //         html`
    //             <vaadin-horizontal-layout style="align-items: center;">
    //                 <div>${this.text}</div>
    //             </vaadin-horizontal-layout>
    //         `,
    //         root
    //     );
    // };

    // -- Main Render -- //
    render() {
        return html`
            <vaadin-notification
                theme="contrast"
                duration="2000"
                ?opened="${this.opened}"
                position="bottom-end"
                @opened-changed="${(e: NotificationOpenedChangedEvent) => {
                    var event = new CustomEvent("opened-changed", { detail: { value: e.detail.value } });
                    this.dispatchEvent(event);
                }}"
                .renderer="${guard([], () => (root: HTMLElement) => {
                    render(
                        html`
                            <vaadin-horizontal-layout style="align-items: center;">
                                <div>${this.text}</div>
                            </vaadin-horizontal-layout>
                        `,
                        root
                    );
                })}"
            ></vaadin-notification>
        `;
    }
}

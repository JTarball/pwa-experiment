import { render, html } from "lit";

import "@vaadin/horizontal-layout";
import { Notification } from "@vaadin/notification";
import { NotificationRenderer, NotificationOpenedChangedEvent } from "@vaadin/notification";

export function renderNotification(renderer: NotificationRenderer, opened: boolean) {
    return html`
        <vaadin-notification
            theme="contrast"
            duration="2000"
            .opened="${opened}"
            @opened-changed="${(e: NotificationOpenedChangedEvent) => {
                opened = e.detail.value;
            }}"
            .renderer="${renderer}"
        ></vaadin-notification>
    `;
}

// export function addToWatchRenderer(root, ) {
//     return render(
//         html`
//             <vaadin-horizontal-layout style="align-items: center;">
//                 <div>Added ${this.notificationSymbol} to your watchlist.</div>
//             </vaadin-horizontal-layout>
//         `,
//         root
//     );
// }

// renderer: NotificationRenderer = (root) => {
//     render(
//         html`
//             <vaadin-horizontal-layout style="align-items: center;">
//                 <div>Added ${this.notificationSymbol} to your watchlist.</div>
//                 <!-- <vaadin-button style="margin-left: var(--lumo-space-xl);" theme="primary" @click="${() => (this.notificationOpened = false)}"> Undo ${this.isMac
//                     ? "⌘"
//                     : "Ctrl-"}Z </vaadin-button> -->
//                 <!-- Ideally, this should be hidden if the
//                      device does not have a physical keyboard -->
//             </vaadin-horizontal-layout>
//         `,
//         root
//     );
// };

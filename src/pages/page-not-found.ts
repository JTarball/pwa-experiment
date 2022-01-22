import { html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { PageElementNotFound, pageNotFoundMeta } from "../helpers/page-element-not-found.js";
import { urlForName } from "../router/index.js";
import { goPath } from "../router/index.js";

import "../components/yld0-simple-message-box/yld0-simple-message-box";

@customElement("page-not-found")
export class PageNotFound extends PageElementNotFound {
    static styles = css`
        :host {
            display: block;
        }

        section {
            margin-top: 200px;
            margin-right: auto;
            margin-left: auto;
            padding: 1rem;
        }
    `;

    render() {
        return html`
            <section>
                <yld0-simple-message-box
                    loaded
                    boxImg="/images/404.svg"
                    boxTitle="Page not found"
                    boxSubtitle="I think you have taken a wrong turn ..."
                    help="Please contact support@yld0.com if you believe you are seeing this page in error."
                >
                    <vaadin-button
                        @click="${() => {
                            goPath(urlForName("home"));
                        }}"
                        theme="primary contrast"
                        >home</vaadin-button
                    >
                </yld0-simple-message-box>
            </section>
        `;
    }

    meta() {
        return pageNotFoundMeta;
    }
}

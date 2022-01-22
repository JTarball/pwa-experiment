import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import "@vaadin/button";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";

import { PageElement } from "../../helpers/page-element.js";
import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { verifyUser } from "../../auth/auth.js";

import "../../components/yld0-simple-message-box/yld0-simple-message-box";

@customElement("page-verify-user")
export class PageVerifyUser extends PageElement {
    @state()
    private loaded: Boolean = false;

    @state()
    private success: Boolean = false;

    @state()
    private title: string = "";

    @state()
    private subtitle: string = "";

    @state()
    private help: string = "Please contact support@yld0.com if you're experiencing issues verifying your account.";

    @state()
    private img: string = "";

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            section {
                margin-top: 200px;
                margin-right: auto;
                margin-left: auto;

                padding: 1rem;
                padding-top: 1rem;
            }

            vaadin-button {
                background-color: var(--lumo-shade-10pct);
            }
        `,
    ];

    private firstUpdated() {
        this.verifyToken();
    }

    private async verifyToken() {
        // Attempt to verify token
        const urlSearchParams = new URLSearchParams(this.location?.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        const token = params.token || "";

        if (token) {
            const response = await verifyUser(token);
            this.loaded = true;

            if (response?.ok) {
                this.title = "Good to go!";
                this.subtitle = "User is now verified, please click below to login in.";
                this.img = "/images/user-verified-tick-green.png"; // svg not working at the moment
            } else {
                const data = await response?.json();
                const error_detail = JSON.stringify(data);

                if (response == undefined) {
                    this.success = false;
                    this.title = "Something is broken";
                    this.subtitle = "We seem to be experiencing some internal issues, hopefully we will solve them soon.";
                    this.img = "/images/server-error.svg";
                    this.help = "Please contact support@yld0.com if this doesn't get resolved.";
                } else if (response?.status == 400) {
                    switch (data.detail) {
                        case "VERIFY_USER_BAD_TOKEN":
                            this.img = "/images/error.svg";
                            this.title = "Urm, Bad Token!";
                            this.subtitle = `The token is invalid for verifying your user.`;
                            break;
                        case "VERIFY_USER_ALREADY_VERIFIED":
                            this.img = "/images/user-verified-tick-grey.svg";
                            this.title = "User is already verified!";
                            this.subtitle = `The user is already verified, you can login.`;
                            break;
                        default:
                            this.subtitle = error_detail;
                    }
                }
            }
        }
    }

    render() {
        return html`
            <section>
                <yld0-simple-message-box ?loaded=${this.loaded} boxImg="${this.img}" boxTitle="${this.title}" boxSubtitle="${this.subtitle}" help="${this.help}">
                    ${this.success ? html`<vaadin-button theme="secondary success">login</vaadin-button>` : html``}
                </yld0-simple-message-box>
            </section>
        `;
    }
}

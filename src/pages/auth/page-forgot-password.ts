import { html, LitElement, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/login";
import "@vaadin/email-field";
import { Notification } from "@vaadin/notification";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";

import { PageElement } from "../../helpers/page-element.js";
import { themeStyles } from "../../themes/yld0-theme/styles.js";

import { userExists, forgotPassword } from "../../auth/auth.js";

import { goPath, getBackUrl } from "../../router/index.js";

import "../../components/yld0-simple-message-box/yld0-simple-message-box";

@customElement("page-forgot-password")
export class PageForgotPassword extends PageElement {
    @state()
    private disableSubmit = false;

    @state()
    private emailSent = false;

    @property()
    private searchEnabled: Boolean = false;

    @query("vaadin-email-field")
    private email?: LoginOverlay;

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            section {
                padding: 1rem;
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
            }
            vaadin-email-field {
                width: 90%;
            }

            #submit {
                /* background-color: var(--lumo-primary-color);
                color: var(--lumo-base-color); */
            }
        `,
    ];

    private firstUpdated() {
        if (this.email) {
            this.email.focus();
        }
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        // Use one column by default
        { minWidth: 0, columns: 1 },
        // Use two columns, if layout's width exceeds 500px
        { minWidth: "500px", columns: 1 },
    ];

    private async handleForgotPassword(e: Event) {
        if (this.email) {
            if (this.email.value) {
                const exists = await userExists(this.email.value);

                if (exists) {
                    await forgotPassword(this.email.value);
                    this.emailSent = true;
                } else {
                    this.disableSubmit = true;
                    Notification.show(`The user for ${this.email.value} does not exist`);

                    // Allow notification to disappear before reenabling the submit button
                    setTimeout(() => {
                        this.disableSubmit = false;
                    }, 5000);
                }
            }
        }
    }

    private handleKeyUp(e: Event) {
        if (e.keyCode === 13) {
            this.handleForgotPassword(e);
        } else {
            if (this.email) {
                this.disableSubmit = !this.email.validate();
            }
        }
    }

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}" ?searchEnabled="${this.searchEnabled}"></top-navbar>
            <section>
                ${this.emailSent
                    ? html`
                          <yld0-simple-message-box loaded boxImg="" boxTitle="Email sent" boxSubtitle="Please check your email for instructions to reset your password." help="">
                          </yld0-simple-message-box>
                      `
                    : html`
                          <h2>Forgot your password?</h2>
                          <p>Enter your registered email address to reset your password.</p>

                          <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                              <vaadin-email-field
                                  autofocus
                                  label="Email address"
                                  name="email"
                                  value=""
                                  error-message="Please enter a valid email address"
                                  clear-button-visible
                                  @keyup="${this.handleKeyUp}"
                              ></vaadin-email-field>
                              <vaadin-button theme="primary contrast" ?disabled=${this.disableSubmit} id="submit" @click="${this.handleForgotPassword}">Submit</vaadin-button>
                          </vaadin-form-layout>
                      `}
            </section>
        `;
    }
}

import { html, LitElement, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/login";
import "@vaadin/email-field";
import "@vaadin/password-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";

import { PageElement } from "../../helpers/page-element.js";
import { themeStyles } from "../../themes/yld0-theme/styles.js";

import { userExists, resetPassword } from "../../auth/auth.js";
import { goPath, urlForName } from "../../router/index.js";

import "../../components/yld0-simple-message-box/yld0-simple-message-box";

@customElement("page-reset-password")
export class PageResetPassword extends PageElement {
    @state()
    private pwdReset = false;

    @state()
    private disableSubmit = false;

    @query("vaadin-password-field#password1")
    private password1?: Element;

    @query("vaadin-password-field#password2")
    private password2?: Element;

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

            .content {
                border-radius: 10px;
                border: 1px solid var(--lumo-contrast-10pct);
                padding: 1rem;
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
        // if (this.password2) {
        //     this.password2.errorMessage =
        // }
        // if (this.email) {
        //     this.email.focus();
        // }
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        // Use one column by default
        { minWidth: 0, columns: 1 },
        // Use two columns, if layout's width exceeds 500px
        { minWidth: "500px", columns: 1 },
    ];

    private async handleSetPasswordReset(e: Event) {
        if (this.password1 && this.password2) {
            const matched = this.passwordsMatch(this.password1.value, this.password2.value);

            if (matched) {
                console.log("matched");
                const resp = await resetPassword(this.password2.value);
                if (resp && resp.ok) {
                    this.pwdReset = true;
                }
            }
        }
    }

    private passwordsMatch(password1: string, password2: string) {
        if (password1 && password2 && password1 != password2) {
            return false;
        } else {
            return true;
        }
    }

    private handleKeyUp(e: Event) {
        if (e.keyCode === 13) {
            //this.handleSetPasswordReset(e);
        } else {
            if (this.password1 && this.password2) {
                const matched = this.passwordsMatch(this.password1.value, this.password2.value);

                if (matched) {
                    this.password2.errorMessage = "passwords do not match";
                    this.password2.setAttribute("invalid", "");
                } else {
                    // reset error message for normal invalid pattern
                    this.password2.errorMessage = "Not a valid password";
                }

                //this.password2.setAttribute("invalid", "");

                // this.disableSubmit = !this.email.validate();
                console.log(this.password1, this.password2);
            }
        }
    }

    render() {
        return html`
            <top-navbar .location=${this.location} ?dark="${this.dark}" @searchopen-changed=${this.handleModalOpen}></top-navbar>
            <section>
                ${this.pwdReset
                    ? html`
                          <yld0-simple-message-box
                              loaded
                              boxImg=""
                              boxTitle="Password has been Reset"
                              boxSubtitle="Your password has been successfully reset. Click below to login."
                              help="Please contact support@yld0.com if you're experiencing issues with resetting your password."
                          >
                              <vaadin-button
                                  @click="${() => {
                                      goPath(urlForName("login"), "");
                                  }}"
                                  theme="small primary contrast"
                                  style="background-color: --var(--lumo-secondary-text-color);"
                                  >login</vaadin-button
                              >
                          </yld0-simple-message-box>
                      `
                    : html`
                          <div class="content">
                              <img src="images/yld0-title.svg" alt="yld0" style="width:50px;" />
                              <h2>Reset password</h2>
                              <p>Please select a new password.</p>

                              <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                                  <vaadin-password-field
                                      id="password1"
                                      label="Password"
                                      @keyup="${this.handleKeyUp}"
                                      pattern="^(?=.*[0-9])(?=.*[a-zA-Z]).{6}.*$"
                                      error-message="Not a valid password"
                                      autofocus
                                  ></vaadin-password-field>
                                  <vaadin-password-field
                                      id="password2"
                                      label="Confirm password"
                                      pattern="^(?=.*[0-9])(?=.*[a-zA-Z]).{6}.*$"
                                      helper-text="A password must be at least 6 characters. It has to have at least one letter and one digit."
                                      error-message="Not a valid password"
                                      @keyup="${this.handleKeyUp}"
                                  ></vaadin-password-field>
                                  <br />
                                  <vaadin-button theme="primary" id="submit" @click="${this.handleSetPasswordReset}">Confirm</vaadin-button>
                              </vaadin-form-layout>
                          </div>
                      `}
            </section>
        `;
    }
}

import { html, LitElement, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";
import { Task, TaskStatus } from "@lit-labs/task";

import "@vaadin/button";
import "@vaadin/login";
import "@vaadin/email-field";
import "@vaadin/password-field";
import { LoginOverlay } from "@vaadin/login";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { observeState } from "lit-element-state";

import { PageElement } from "../../helpers/page-element.js";
import { themeStyles } from "../../themes/yld0-theme/styles.js";

import { registerUser, askToVerifyUser, userVerified } from "../../auth/auth.js";
import { myState } from "../../store/state.js";
import { goPath, urlForName } from "../../router/index.js";

import "../../components/molecules/yld0-simple-message-box/yld0-simple-message-box";

function sleep(interval) {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
}

@customElement("page-register")
export class PageRegister extends observeState(PageElement) {
    // Page to register a new user

    @state()
    disableSubmit = true;

    @state()
    errorMsg: string = "";

    @state()
    verificationSent = false;

    @query("vaadin-text-field")
    username?: Element;

    @query("vaadin-email-field")
    email?: Element;

    @query("vaadin-password-field")
    password?: Element;

    // Support for: Simple task to periodically check if user is verified yet.
    private _isUserVerifiedTask = new Task(this, this.checkUserVerified, () => this.verifyingEmail);

    @state()
    verifyingEmail: string = "";

    @state()
    userVerified = false;

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

                margin-right: auto;
                margin-left: auto;

                min-width: 220px;
                min-height: 220px;
            }

            .content {
                border-radius: 10px;
                border: 1px solid var(--lumo-contrast-10pct);
                padding: 1rem;
            }

            .center {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #bgImg {
                width: 30%;
                position: absolute;
                top: 50%;
                left: 45%;
                transform: translate(-50%, -50%);
            }

            #orDivider::before {
                content: "";
                position: absolute;
                left: 0;
                top: 10%;
                width: 100%;
                height: 0;
                opacity: 0.24;
                border-bottom: 1px solid #8c9b9b;
            }

            vaadin-button#btn-google {
                align-items: center;
                display: flex;
                text-align: center;
                line-height: 40px;
                border: 1px grey;
            }

            #btn-google-logo {
                display: inline-block;
                width: 24px;
                height: 24px;
                padding-right: 16px;
                background: url("/images/btn-google.svg") center no-repeat;
            }

            #errorMsg {
                margin-left: calc(var(--lumo-border-radius-m) / 4);
                font-size: var(--lumo-font-size-xs);
                line-height: var(--lumo-line-height-xs);
                color: var(--lumo-error-text-color);
                will-change: max-height;
                transition: 0.4s max-height;
                max-height: 5em;
            }
        `,
    ];

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        // Use one column by default
        { minWidth: 0, columns: 1 },
        // Use two columns, if layout's width exceeds 500px
        { minWidth: "500px", columns: 1 },
    ];

    private handleKeyUp(e: Event) {
        if (e.keyCode === 13) {
            this.handleRegisterUser();
        } else {
            if (this.email && this.password) {
                this.disableSubmit = !(this.email.validate() && this.password.validate());
                console.log(this.disableSubmit);
            }
        }
    }

    private async handleRegisterUser() {
        const response = await registerUser(this.username.value, this.email?.value, this.password.value);
        const data = await response?.json();
        const data_str = JSON.stringify(data);

        if (response.ok) {
            this.verificationSent = true;
            this.verifyingEmail = this.email?.value;
        } else {
            this.errorMsg = data_str;

            if (response.status == 400) {
                switch (data.detail) {
                    case "REGISTER_USER_ALREADY_EXISTS":
                        this.errorMsg = `There is already a registered user with email: ${this.email.value}.`;
                        break;
                    case "REGISTER_INVALID_PASSWORD":
                        this.errorMsg = `Apologises your password is not valid, please choose another.`;
                        break;
                    default:
                }
            }
        }
    }

    private async handleResendEmailVerification() {
        if (this.verifyingEmail) {
            await askToVerifyUser(this.verifyingEmail);
        }
    }

    private async checkUserVerified(email: string) {
        // Periodically check if the user is now verified via the email link
        if (email) {
            while (!this.userVerified) {
                this.userVerified = await userVerified(email);
                await sleep(3000);
            }
        }
    }

    render() {
        return html`
            <section>
                ${this.verificationSent
                    ? html`
                          ${this._isUserVerifiedTask.render({
                              pending: () => html`
                                  <yld0-simple-message-box
                                      loaded
                                      boxImg="/images/mail.svg"
                                      boxTitle="Verify your account"
                                      boxSubtitle="We've sent a link to ${this.verifyingEmail}"
                                      help="Please contact support@yld0.com if you're experiencing issues with account verification"
                                  >
                                      <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing">
                                          <span style="font-size: var(--lumo-font-size-xxs)">Haven't received an email? </span>
                                          <vaadin-button @click="${this.handleResendEmailVerification}" theme="small primary contrast" style="background-color: --var(--lumo-secondary-text-color);"
                                              >Resend email</vaadin-button
                                          >
                                      </vaadin-horizontal-layout>
                                  </yld0-simple-message-box>
                              `,
                              complete: () => html`
                                  <yld0-simple-message-box
                                      loaded
                                      boxImg="/images/user-verified-tick-green.png"
                                      boxTitle="Good to go!"
                                      boxSubtitle="User is now verified, please click below to login in."
                                      help=""
                                  >
                                      <vaadin-button
                                          @click="${() => {
                                              goPath(urlForName("login"), "");
                                          }}"
                                          theme="small primary contrast"
                                          style="background-color: --var(--lumo-secondary-text-color);"
                                          >Go to login</vaadin-button
                                      >
                                  </yld0-simple-message-box>
                              `,
                          })}
                      `
                    : html`
                          <top-navbar .location=${this.location}></top-navbar>
                          <div class="content">
                              <img src="images/yld0-title.svg" alt="yld0" style="width:50px;" />
                              <h2>Create an account</h2>
                              <p id="errorMsg">${this.errorMsg}</p>
                              <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                                  <!-- Stretch the username field over 2 columns -->
                                  <vaadin-text-field label="Username" required></vaadin-text-field>
                                  <vaadin-email-field
                                      @keyup="${this.handleKeyUp}"
                                      label="Email address"
                                      name="email"
                                      error-message="Please enter a valid email address"
                                      clear-button-visible
                                      required
                                  ></vaadin-email-field>
                                  <vaadin-password-field
                                      @keyup="${this.handleKeyUp}"
                                      label="Password"
                                      pattern="^(?=.*[0-9])(?=.*[a-zA-Z]).{6}.*$"
                                      helper-text="A password must be at least 6 characters. It has to have at least one letter and one digit."
                                      error-message="Not a valid password"
                                      required
                                  ></vaadin-password-field>
                              </vaadin-form-layout>
                              <!-- Need better css than a br -->
                              <br />
                              <vaadin-button theme="primary" id="submit" ?disabled=${this.disableSubmit} @click="${this.handleRegisterUser}">Confirm</vaadin-button>
                          </div>
                      `}
            </section>
        `;
    }
}

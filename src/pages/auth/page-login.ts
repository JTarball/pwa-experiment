import { html, LitElement, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/login";
import { LoginOverlay } from "@vaadin/login";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { observeState } from "lit-element-state";

import { PageElement } from "../../helpers/page-element.js";
import { themeStyles } from "../../themes/yld0-theme/styles.js";

import { loginUser, setInitialRefreshToken, googleAuthorise, googleCallback } from "../../auth/auth.js";
import { myState } from "../../store/state.js";
import { goPath, urlForName } from "../../router/index.js";

function sleep(interval) {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
}

@customElement("page-login")
export class PageLogin extends observeState(PageElement) {
    @state()
    private loginOpened = false;

    @query("vaadin-login-overlay")
    private login?: LoginOverlay;

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            :root {
                --lumo-font-size-tiny: 0.8em;
                --lumo-font-size-micro: 0.67rem;

                /* HACK - DO NOT CHANGE: Do not change else yld0-ellipsis and history page background color will be affected */
                --_lumo-button-background-color: none;
                --_lumo-button-color: var(--secondary-text-color);

                --lumo-primary-color: black;
            }

            section {
                padding: 1rem;
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
                /* background-color: #002b36; */
            }

            #bgImg {
                width: 30%;
                position: absolute;
                top: 50%;
                left: 45%;
                transform: translate(-50%, -50%);
            }
            /* 
            #orDivider::before {
                content: "";
                position: absolute;
                left: 0;
                top: 10%;
                width: 100%;
                height: 0;
                opacity: 0.24;
                border-bottom: 1px solid #8c9b9b;
            } */
            /* 
            #orDivider {
                width: 80%;
                text-align: center;
                font-size: var(--lumo-font-size-m);
                position: relative;
            }

            #orDivider:before,
            #orDivider:after {
                content: "";
                width: 100%;
                border-bottom: solid 1px var(--lumo-shade-20pct);
                position: absolute;

                left: 0;
                top: 50%;
            } */

            h4 {
                width: auto;
                display: block;
                z-index: 10;
                padding: 0;
                color: var(--lumo-shade-30pct);
                position: relative;
                font-weight: lighter;
                margin: 0;
                margin: 0 0px 0 0px;
                background-color: white;

                /* margin: 10px auto;
                text-align: center;

                max-width: 300px;
                position: relative; */
            }

            h4:before {
                content: "";
                display: block;
                width: 130px;
                height: 1px;
                background: var(--lumo-shade-10pct);
                position: absolute;
                left: 120%;
                top: 50%;
                z-index: -2;
            }
            h4:after {
                content: "";
                display: block;
                width: 130px;
                height: 1px;
                background: var(--lumo-shade-10pct);
                position: absolute;
                right: 120%;
                top: 50%;
                z-index: -2;
            }

            #btn-google {
                align-items: center;
                display: flex;
                text-align: center;
                line-height: 20px;
                border: 1px grey;
                background-color: --var(--lumo-secondary-text-color);
                padding: 24px 22px 28px 22px;
                border: 2px solid black;
            }

            #btn-google-logo {
                display: inline-block;
                width: 24px;
                height: 24px;
                padding-right: 16px;
                text-align: center;
                background: url("/images/btn-google.svg") center no-repeat;
                position: relative;
                top: 5px;
            }

            div[part="brand"] {
                background-color: red;
            }

            footer {
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;

                /* position: fixed;

                bottom: 0;
                width: 0%;

                padding: 1rem;
                text-align: center;
                background-color: var(--lumo-base-color);
                display: block;

                overflow: hidden;
                position: fixed;

                text-align: center;
                margin-left: auto;
                margin-right: auto; */
            }

            /* Login Styling */
            [part="content"] {
                background-color: black;
            }

            [part="title"] {
                background-color: red;
            }

            [theme="my-styled-select"] [part="title"] {
                background-color: yellow;
                color: red;
            }
        `,
    ];

    firstUpdated() {
        // Error message can be changed via Internationalization (i18n)
        if (this.login && this.login.i18n) {
            this.login.i18n = {
                ...this.login.i18n,
                additionalInformation: `Please contact support@yld0.com if you're experiencing sustained issues verifying into your account.`,
            };
        }
    }

    private async handleLogin(e: Event, username: string, password: string) {
        console.debug("handleLogin");
        //myState.jwt_token
        const response = await loginUser(username, password);

        if (response === undefined) {
            if (this.login && this.login.i18n) {
                this.login.i18n = {
                    ...this.login.i18n,
                    errorMessage: {
                        title: "Internal server error",
                        message: "There is a problem connecting to the auth service. :(",
                    },
                };
                this.login.setAttribute("error", "");
            }
        } else if (response.ok) {
            // If successful, save the access token in memory only
            // and set the refresh token

            // Redirect to home
            goPath("/", "");
        } else {
            if (this.login && this.login.i18n) {
                this.login.i18n = {
                    ...this.login.i18n,
                    errorMessage: {
                        title: "Incorrect username or password",
                        message: "Check that you have entered the correct username and password and try again.",
                    },
                };
                this.login.setAttribute("error", "");
            }
        }

        //this.loginOpened = false;
    }

    private async handleForgotPassword() {
        goPath("/forgot-password", "?backurl=/login");
    }

    private async handleOauth() {
        const response = await googleAuthorise();

        if (response?.ok) {
            const data = await response?.json();
            const authorisation_url = data.authorization_url;

            // NUNO: Need Nuno to sort this mess out, this is just wrong
            // the page-oauth-support
            window.open(authorisation_url, "_blank", "toolbar=0,location=0,menubar=0");

            // NUNO: A crap and incorrect way of expecting the other page to be a window and to be closed.
            await sleep(3000);
            goPath(urlForName("home"), "");
        } else {
            const data = await response?.json();
            const error_detail = JSON.stringify(data);
            console.error(`Failed to authorise with google: ${error_detail}`);
        }
    }

    render() {
        return html`
            <section>
                <img id="bgImg" src="images/login-logo.svg" alt="" />
                <vaadin-button
                    @click="${() => {
                        goPath(urlForName("register"), "?backurl=/login");
                    }}"
                    theme="secondary contrast"
                    style="background-color: var(--lumo-shade-20pct)"
                >
                    Register
                </vaadin-button>
                <vaadin-login-overlay
                    theme="black"
                    title=""
                    description=""
                    .opened="${this.loginOpened}"
                    @login="${(e) => {
                        console.log(e);
                        this.handleLogin(e, e.detail.username, e.detail.password);
                    }}"
                    @forgot-password="${this.handleForgotPassword}"
                ></vaadin-login-overlay>
            </section>

            <footer>
                <section>
                    <vaadin-vertical-layout theme="spacing" style="align-items: center;">
                        <vaadin-button @click="${() => (this.loginOpened = true)}" theme="primary contrast normal"> Log in with Email </vaadin-button>
                        <div><h4>or</h4></div>
                        <vaadin-button id="btn-google" theme="secondary contrast normal" @click="${this.handleOauth}">
                            <div id="btn-google-logo"></div>
                            Sign in with Google
                        </vaadin-button>
                    </vaadin-vertical-layout>
                </section>
            </footer>
        `;
    }
}

/*
A basic page to support oauth authentication: This is the REDIRECT_URL for google oauth

This page is used as the redirect url:
 - Make sure you have added it to Authorised redirect URIs under https://console.cloud.google.com/apis/credentials

We need to call the callback from the authentication service to get the access token or to handle error from the google oauth params 

*/
import { html, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import "@vaadin/button";
import "@vaadin/login";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { observeState } from "lit-element-state";

import { PageElement } from "../../helpers/page-element.js";
import { themeStyles } from "../../themes/yld0-theme/styles.js";

import { googleCallback } from "../../auth/auth.js";

import { goPath, urlForName } from "../../router/index.js";

import "../../components/yld0-simple-message-box/yld0-simple-message-box";

@customElement("page-oauth-support")
export class PageOAuthSupport extends observeState(PageElement) {
    @state()
    private loaded: Boolean = false;

    @state()
    private title: string = "";

    @state()
    private subtitle: string = "";

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
                background-color: var(--lumo-shade-40pct);
            }
        `,
    ];

    async performUpdate() {
        await this.google_callback();
        super.performUpdate();
    }

    private async google_callback() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const params = Object.fromEntries(urlParams.entries());

        const code = params.code || "";
        const state = params.state || "";
        const error = params.error || "";

        if (code && state) {
            const response = await googleCallback(queryString);

            if (response?.ok) {
                window.close();
            } else {
                this.loaded = true;
                const data = await response?.json();
                const error_detail = JSON.stringify(data);
                console.log(response);
                console.log(data);

                if (response == undefined) {
                    this.title = "Error";
                    this.subtitle = "Unfortunately we cannot connect to our authentication service to verify your user. This is an internal issue which hopefully we will resolve soon.";
                } else {
                    switch (data.detail) {
                        case "LOGIN_BAD_CREDENTIALS":
                            this.title = "Urm, Bad Creds";
                            this.subtitle = `The credentials for your user seems to be incorrect.`;
                            break;
                        default:
                            this.title = "Error";
                            this.subtitle = response.statusText || error_detail;
                    }
                }
            }
        }
    }

    render() {
        return html`
            <section>
                <yld0-simple-message-box
                    ?loaded=${this.loaded}
                    boxImg="/images/error.svg"
                    boxTitle="${this.title}"
                    boxSubtitle="${this.subtitle}"
                    help="Please contact support@yld0.com if you believe you are seeing this page in error."
                >
                    <vaadin-button
                        @click="${() => {
                            goPath(urlForName("login"), "");
                        }}"
                        theme="primary contrast"
                        >back to login</vaadin-button
                    >
                </yld0-simple-message-box>
            </section>
        `;
    }
}

import "@vaadin/polymer-legacy-adapter";
import "@vaadin/vaadin-app-layout";

import "@vaadin/vaadin-app-layout/vaadin-drawer-toggle";
import "@vaadin/vaadin-avatar/vaadin-avatar";
import "@vaadin/vaadin-context-menu";
import "@vaadin/vaadin-tabs";
import "@vaadin/vaadin-tabs/vaadin-tab";
import { css, LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
// import { router } from '../index';
import { routes } from "../router/routes";
// import { appStore } from '../stores/app-store';
// import { Layout } from './view';

interface RouteInfo {
    path: string;
    title: string;
    icon: string;
}

@customElement("main-layout")
export class MainLayout extends LitElement {
    static styles = css`
        [slot="drawer"] {
            background-image: linear-gradient(0deg, var(--lumo-shade-5pct), var(--lumo-shade-5pct));
        }

        [slot="drawer"] nav a {
            text-decoration: none;
            transition: color 140ms;
        }

        [slot="drawer"] nav a .la {
            margin-top: calc(var(--lumo-space-xs) * 0.5);
        }

        [slot="drawer"] nav a::before {
            border-radius: var(--lumo-border-radius);
            bottom: calc(var(--lumo-space-xs) * 0.5);
            content: "";
            left: 0;
            position: absolute;
            right: 0;
            top: calc(var(--lumo-space-xs) * 0.5);
            transition: background-color 140ms;
        }

        [slot="drawer"] nav a[highlight] {
            color: var(--lumo-primary-text-color);
        }

        [slot="drawer"] nav a[highlight]::before {
            background-color: var(--lumo-primary-color-10pct);
        }

        [slot="drawer"] footer vaadin-context-menu {
            align-items: center;
            display: flex;
        }
    `;

    render() {
        return html`
            <vaadin-app-layout primary-section="drawer">
                <header class="bg-base border-b border-contrast-10 box-border flex h-xl items-center w-full" slot="navbar">
                    <vaadin-drawer-toggle aria-label="Menu toggle" class="text-secondary" theme="contrast"></vaadin-drawer-toggle>
                    <h1 class="m-0 text-l">currentViewTitle</h1>
                </header>
                <section class="flex flex-col items-stretch max-h-full min-h-full" slot="drawer">
                    <h2 class="flex items-center h-xl m-0 px-m text-m">applicationName</h2>
                    <nav aria-labelledby="views-title" class="border-b border-contrast-10 flex-grow overflow-auto">
                        <h3 class="flex items-center h-m mx-m my-0 text-s text-tertiary" id="views-title">Views</h3>
                        <ul class="list-none m-0 p-0">
                            ${this.getMenuRoutes().map(
                                (viewRoute) => html`
                  <li>
    
                      <span class="${viewRoute.icon} me-s text-l"></span>
                      <span class="font-medium text-s">${viewRoute.title}</span>
                    </a>
                  </li>
                `
                            )}
                        </ul>
                    </nav>
                    <footer class="flex items-center my-s px-m py-xs"></footer>
                </section>
                <slot></slot>
            </vaadin-app-layout>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add("block", "h-full");
        // this.reaction(
        //   () => appStore.location,
        //   () => {
        //     AppLayoutElement.dispatchCloseOverlayDrawerEvent();
        //   }
        // );
    }

    private getMenuRoutes(): RouteInfo[] {
        return routes.filter((route) => route.name) as RouteInfo[];
    }
}

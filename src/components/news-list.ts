import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { shadows } from "@vaadin/vaadin-lumo-styles/utilities/shadows.js";

import { NewsArticle } from "../store/models.js";

@customElement("news-list")
class NewsList extends LitElement {
    @property()
    private items?: NewsArticle[];

    static styles = [
        shadows,
        utility,
        themeStyles,
        css`
            ul {
                margin: 0;
                padding: 0;
                /* padding-left: var(--lumo-space-xs);
                padding-right: var(--lumo-space-xs);
                padding-top: var(--lumo-space-s);
                padding-bottom: var(--lumo-space-s); */
            }
            .header {
                width: auto;
                background: #eee;
            }
            h4 {
                padding: var(--lumo-space-s);
                margin: 0;
            }

            .news {
                margin-top: 20px;
                padding-left: 10px;
                padding-right: 10px;
            }

            .news img {
                margin: 10px;
            }

            .headline {
                font-size: var(--lumo-font-size-s);
                font-weight: 800;
            }

            .summary {
                font-size: var(--lumo-font-size-xxs);
            }

            .source {
                color: var(--lumo-contrast-70pct);
                font-size: var(--lumo-font-size-xxs);
            }

            .timeago {
                text-align: right;
                align: right;
            }
        `,
    ];

    async firstUpdated() {
        //const { people } = await getPeople();
        const people: NewsArticle[] = [
            {
                headline: "Nasdaq 100 Movers: ALGN, PTON",
                date: 1638203700,
                summary:
                    "In early trading on Monday, shares of Peloton Interactive topped the list of the day's best performing components of the Nasdaq 100 index, trading up 6.0%.  Year to date, Peloton Interactive has lost about 73.1% of its value.",
                image: "https://www.nasdaq.com/sites/acquia.prod/files/2019-05/0902-Q19%20Total%20Markets%20photos%20and%20gif_CC8.jpg?1328470272",
                source: "MarketWatch",
            },
            {
                headline: "Nasdaq 200",
                date: 1638203700,
                summary:
                    "In early trading on Monday, shares of Peloton Interactive topped the list of the day's best performing components of the Nasdaq 100 index, trading up 6.0%.  Year to date, Peloton Interactive has lost about 73.1% of its value.",
                image: "https://www.nasdaq.com/sites/acquia.prod/files/2019-05/0902-Q19%20Total%20Markets%20photos%20and%20gif_CC8.jpg?1328470272",
                source: "MarketWatch",
            },
            {
                headline: "Nasdaq 100 Movers: ALGN, PTON",
                date: 1638203700,
                summary:
                    "In early trading on Monday, shares of Peloton Interactive topped the list of the day's best performing components of the Nasdaq 100 index, trading up 6.0%.  Year to date, Peloton Interactive has lost about 73.1% of its value.",
                image: "https://www.nasdaq.com/sites/acquia.prod/files/2019-05/0902-Q19%20Total%20Markets%20photos%20and%20gif_CC8.jpg?1328470272",
                source: "MarketWatch",
            },
            {
                headline: "Nasdaq 200",
                date: 1638203700,
                summary:
                    "In early trading on Monday, shares of Peloton Interactive topped the list of the day's best performing components of the Nasdaq 100 index, trading up 6.0%.  Year to date, Peloton Interactive has lost about 73.1% of its value.",
                image: "https://www.nasdaq.com/sites/acquia.prod/files/2019-05/0902-Q19%20Total%20Markets%20photos%20and%20gif_CC8.jpg?1328470272",
                source: "MarketWatch",
            },
            {
                headline: "Nasdaq 100 Movers: ALGN, PTON",
                date: 1638203700,
                summary:
                    "In early trading on Monday, shares of Peloton Interactive topped the list of the day's best performing components of the Nasdaq 100 index, trading up 6.0%.  Year to date, Peloton Interactive has lost about 73.1% of its value.",
                image: "https://www.nasdaq.com/sites/acquia.prod/files/2019-05/0902-Q19%20Total%20Markets%20photos%20and%20gif_CC8.jpg?1328470272",
                source: "MarketWatch",
            },
            {
                headline: "Nasdaq 200",
                date: 1638203700,
                summary:
                    "In early trading on Monday, shares of Peloton Interactive topped the list of the day's best performing components of the Nasdaq 100 index, trading up 6.0%.  Year to date, Peloton Interactive has lost about 73.1% of its value.",
                image: "https://www.nasdaq.com/sites/acquia.prod/files/2019-05/0902-Q19%20Total%20Markets%20photos%20and%20gif_CC8.jpg?1328470272",
                source: "MarketWatch",
            },
        ];
        this.items = people;
    }

    private truncate = (str: string, length: int = 100) => {
        return str.length > length ? str.substring(0, length - 3) + "..." : str;
    };

    private newsRenderer(item: NewsArticle) {
        return html`
            <div class="news">
                <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                    <img src="${item.image}" class="shadow-s" width="50" height="50" alt="" />
                    <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                        <div class="headline">${item.headline}</div>
                        <div class="summary overflow-ellipsis">${this.truncate(item.summary)}</div>
                        <span class="source">5 days ago from ${item.source}</span>
                    </vaadin-vertical-layout>
                </vaadin-horizontal-layout>
            </div>
        `;
    }

    render() {
        return html`
            <ul>
                ${this.items?.map((i) => html`<li>${this.newsRenderer(i)}</li>`)}
            </ul>
        `;
    }
}

import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";

import "@vaadin/icon";

export const renderPriceChangeIcon = (stock: Object) => {
    // return html`
    // ${stock.price_change ? html`<span class="${stock.price_change > 0 ? "success" : "error"}">${stock.price_change > 0 ? "+" : ""}${stock.price_change.toFixed(3)}</span>` : html`?`} |
    // ${stock.price_change_percent
    //     ? html`<span class="priceChange" theme="badge small ${stock.price_change_percent > 0 ? "success" : "error"}"
    //           >${stock.price_change_percent > 0 ? "+" : ""}${stock.price_change_percent}%</span
    //       >`
    //     : html`?`}

    // style.js for the css of icons

    let classes;
    let trendUp = false;
    let trendDown = false;
    if (stock.price_change > 0) {
        trendUp = true;
    } else {
        trendDown = true;
    }

    classes = { trendingUp: trendUp, trendingDown: trendDown };

    return html` <vaadin-icon class="${classMap(classes)}" icon="lumo:arrow-down"></vaadin-icon> `;
};

export const render1dPriceChange = (stock: Object) => {
    return html`${renderPriceChangeIcon(stock)}<span class="${stock.price_change > 0 ? "priceUp" : "priceDown"}"
            >1d ${stock.price_change > 0 ? "+" : ""}${stock.price_change?.toFixed(3)} (${stock.price_change_percent}%)</span
        >`;
};

export const render1yrPriceChange = (stock: Object) => {
    if (!stock.price_change_1yr) {
        return "";
    }

    return html`${renderPriceChangeIcon(stock)}<span class="${stock.price_change_1yr > 0 ? "priceUp" : "priceDown"}"
            >1yr ${stock.price_change_1yr > 0 ? "+" : ""}${stock.price_change_1yr?.toFixed(3)} (${stock.price_change_1yr_percent}%)</span
        >`;
};

// <!-- ${this.priceMeta}
// <span style="color: var(--lumo-secondary-text-color);font-size: var(--lumo-font-size-tiny);">${this.priceMetaClass == "over" ? "over the current price" : "under the current price"}</span> -->

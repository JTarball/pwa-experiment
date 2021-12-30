/* Full Page Modal */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@vaadin/avatar";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/grid";
import "@vaadin/vaadin-radio-button";
import "@vaadin/button";
import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/text-field";
import "@vaadin/vertical-layout";
import "@vaadin/text-area";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/menu-bar";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";

import { themeStyles } from "../../themes/yld0-theme/styles.js";
import { Stock } from "../../store/models.js";
import { goPath } from "../../router/index.js";

import "../page-modal.js";
import "../yld0-ellipsis.js";

@customElement("home-watchlist")
class YLD0HomeWatchList extends LitElement {
    /* Properties, states etc. */

    @state()
    private items_watchlist?: Stock[];

    @state()
    private priceSelected?: String = "2";

    @state()
    private minimalMode: Boolean = false;

    @state()
    private items_menu = [
        {
            component: this.createMenuItem(),
            children: [{ text: "Suggest new feature" }, { text: "Delete" }],
        },
    ];

    // End of properties ...

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles, // Table styling and a few extras
        css`
            table {
                margin-top: 0px;
            }
            vaadin-list-box {
                font-weight: 200;
            }

            #viewmodes {
                float: right;
                padding-top: 10px;
                position: sticky;
                min-height: 100px;
            }

            span.bgDescription {
                font-size: var(--lumo-font-size-s);
                color: var(--divider-color);
                padding: 10px;
                font-family: "IBM Plex Sans", sans-serif;
                /* font-weight: 100; */
                position: absolute;
                top: 65%;
                left: 15%;
                display: table;
                margin-left: auto;
                margin-right: auto;
            }

            span.bgHeader {
                font-size: var(--lumo-font-size-l);
                color: var(--divider-color);
                padding: 15px;
                font-family: "IBM Plex Sans", sans-serif;
                font-weight: 300;
                position: absolute;
                top: 60%;
                left: 25%;
                display: table;
                margin-left: auto;
                margin-right: auto;
            }

            #wrapper {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                border: 0;
            }
            #wrapper td {
                vertical-align: middle;
                text-align: center;
            }
            #bgImg {
                width: 100%;
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: block;
            }
        `,
    ];

    async firstUpdated() {
        const items_watchlist: Stock[] = [
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "2.434",
                priceChangeSinceWatched: "6.00",
                priceChangeSinceWatchedPercent: "1.466",
            },
            {
                symbol: "MSFT",
                companyName: "Microsoft Corp",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                price: "$348",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "3.566",
                priceChangeSinceWatched: "6.34",
                priceChangeSinceWatchedPercent: "2.416",
            },
            {
                symbol: "AMD",
                companyName: "Advanced Micro Devices, Inc.",
                logoUrl: "https://logo.clearbit.com/amd.com",
                price: "$137.75",
                priceChange: "3.00",
                priceChangePercent: "0.3",
                priceChange1yr: "6.00",
                priceChange1yrPercent: "2.466",
                priceChangeSinceWatched: "8.12",
                priceChangeSinceWatchedPercent: "2.366",
            },
        ];
        this.items_watchlist = items_watchlist;
        //this.items_watchlist = [];
    }

    private handlePriceView(e: Event) {
        // Change the selected
        console.debug("handlePriceView,", e.detail);
        this.priceSelected = e.detail.value;
    }

    private handleMinimalMode(e: Event) {
        // Change the selected
        console.debug("handlePriceView,", e.detail);
        this.minimalMode = e.detail.value == 0;
    }

    private showPriceChange(item: Stock) {
        // show price change dependent on selected vaadin-list-box

        switch (this.priceSelected) {
            case 0:
                return html`
                    ${item.priceChange ? html`<span class="${item.priceChange > 0 ? "success" : "error"}">${item.priceChange > 0 ? "+" : ""}${item.priceChange}</span>` : html`?`} |
                    ${item.priceChangePercent
                        ? html`<span class="priceChange" theme="badge small ${item.priceChangePercent > 0 ? "success" : "error"}"
                              >${item.priceChangePercent > 0 ? "+" : ""}${item.priceChangePercent}%</span
                          >`
                        : html`?`}
                `;
            case 1:
                return html`
                    ${item.priceChange1yr ? html`<span class="${item.priceChange1yr > 0 ? "success" : "error"}">${item.priceChange1yr > 0 ? "+" : ""}${item.priceChange1yr}</span>` : html`?`} |
                    ${item.priceChange1yrPercent
                        ? html`<span class="priceChange" theme="badge small ${item.priceChange1yrPercent > 0 ? "success" : "error"}"
                              >${item.priceChange1yrPercent > 0 ? "+" : ""}${item.priceChange1yrPercent}%</span
                          >`
                        : html`?`}
                `;
            case 2:
                return html`
                    ${item.priceChangeSinceWatched
                        ? html`<span class="${item.priceChangeSinceWatched > 0 ? "success" : "error"}">${item.priceChangeSinceWatched > 0 ? "+" : ""}${item.priceChangeSinceWatched}</span>`
                        : html`?`}
                    |
                    ${item.priceChangeSinceWatchedPercent
                        ? html`<span theme="badge small ${item.priceChangeSinceWatchedPercent > 0 ? "success" : "error"}"
                              >${item.priceChangeSinceWatchedPercent > 0 ? "+" : ""}${item.priceChangeSinceWatchedPercent}%</span
                          >`
                        : html`?`}
                `;
            default:
                return html`
                    ${item.priceChangeSinceWatched
                        ? html`<span class="${item.priceChangeSinceWatched > 0 ? "success" : "error"}">${item.priceChangeSinceWatched > 0 ? "+" : ""}${item.priceChangeSinceWatched}</span>`
                        : html`?`}
                    |
                    ${item.priceChangeSinceWatchedPercent
                        ? html`<span class="priceChange" theme="badge small ${item.priceChangeSinceWatchedPercent > 0 ? "success" : "error"}"
                              >${item.priceChangeSinceWatchedPercent > 0 ? "+" : ""}${item.priceChangeSinceWatchedPercent}%</span
                          >`
                        : html`?`}
                `;
        }
    }

    private createMenuItem() {
        const item = document.createElement("vaadin-icon");
        item.setAttribute("aria-label", "Other  options");
        item.setAttribute("icon", `vaadin:ellipsis-dots-v`);

        return item;
    }

    private handleMenuAction(e: Event, item: Stock) {
        console.log("handleMenuAction", e.detail.value);
        const value = e.detail.value;

        if (value.text == "Delete") {
            this.items_watchlist = this.items_watchlist.filter((e) => e !== item);
        }
    }

    private goStock() {
        goPath("/stocks/", "?backurl=/");
    }

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                ${this.items_watchlist?.length == 0
                    ? html`
                          <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                              <vaadin-button class="buttonAdd">Add</vaadin-button>
                          </vaadin-vertical-layout>

                          <!-- <table id="wrapper">
                              <td><img id="bgImg" src="images/bg-watchlist.png" alt="" /></td>
                              <span class="bgHeader">No alerts added yet. </span>
                              <span class="bgDescription">Click <em>Add</em> to add a stock to start adding alerts.</span>
                          </table> -->
                      `
                    : html`
                          <table>
                              <thead>
                                  <tr>
                                      <th style="vertical-align: bottom;">
                                          <span class="headerTitle">Following</span>
                                      </th>

                                      <vaadin-horizontal-layout id="viewmodes" style="align-items: right;" theme="spacing">
                                          ${this.minimalMode
                                              ? html``
                                              : html`
                                                    <vaadin-list-box
                                                        @selected-changed=${this.handlePriceView}
                                                        style="font-size: var(--lumo-font-size-micro); margin: 0px;  float:right;"
                                                        selected="${this.priceSelected}"
                                                    >
                                                        <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);"
                                                            >1d change</vaadin-item
                                                        >
                                                        <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);"
                                                            >1yr change</vaadin-item
                                                        >
                                                        <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px;  padding: 3px;min-height:  var(--lumo-font-size-micro);"
                                                            >Since watched</vaadin-item
                                                        >
                                                    </vaadin-list-box>
                                                `}

                                          <vaadin-list-box
                                              @selected-changed=${this.handleMinimalMode}
                                              style="position: sticky; font-size: var(--lumo-font-size-micro); margin: 0px;  float:right;"
                                              selected="1"
                                          >
                                              <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);"
                                                  >minimal mode</vaadin-item
                                              >
                                              <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);">prices</vaadin-item>
                                          </vaadin-list-box>
                                      </vaadin-horizontal-layout>

                                      <!-- <th style="padding-right: 0px;"></th>
                            <th style="padding-right: 0px;"></th> -->
                                  </tr>
                                  <thead></thead>
                              </thead>
                              ${this.items_watchlist?.map((item, index) => {
                                  return html`
                                      <tr role="row" index="${index}" @click=${this.goStock}>
                                          <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                                          <td style="width: 65%;">
                                              <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                                  <vaadin-avatar img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                                                  <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                      <span class="stockSymbol">${item.symbol} </span>
                                                      <span class="companyName">${item.companyName}</span>
                                                  </vaadin-vertical-layout>
                                              </vaadin-horizontal-layout>
                                          </td>
                                          <td style="width:30%; text-align: right;">
                                              <vaadin-horizontal-layout style="float:right;" theme="spacing">
                                                  <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                      ${this.minimalMode
                                                          ? html``
                                                          : html`
                                                                <span style="padding-left: 10px; font-size: 1.0em; font-weight: 500; color: var(--primary-text-color);">${item.price}</span>
                                                                <span class="priceChange">${this.showPriceChange(item)}</span>
                                                            `}
                                                  </vaadin-vertical-layout>
                                              </vaadin-horizontal-layout>
                                          </td>
                                          <td style="width: 5%;">
                                              <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                  <span class="ellipsis">
                                                      <vaadin-menu-bar
                                                          index=${index}
                                                          @item-selected=${(e) => this.handleMenuAction(e, item)}
                                                          theme="icon"
                                                          .items="${this.items_menu}"
                                                      ></vaadin-menu-bar>
                                                      <!-- <yld0-ellipsis @item-selected=${(e) => this.handleMenuAction(e, item)} .items="${this.items_menu}" ></yld0-ellipsis> -->
                                                      <!-- <vaadin-icon id="ellipsis" icon="vaadin:ellipsis-dots-v"></vaadin-icon> -->
                                                  </span>
                                              </vaadin-vertical-layout>
                                          </td>
                                      </tr>
                                  `;
                              })}
                          </table>
                      `}
            </section>
            <br />
            <!-- slot, just in case -->
            <slot></slot>
        `;
    }
}

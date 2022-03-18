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
import { UserStock } from "../../store/models.js";

@customElement("history-home")
class YLD0HistoryHome extends LitElement {
    /* Properties, states etc. */
    @state()
    private minimalMode: Boolean = false;

    @state()
    private items_stocks?: UserStock[];

    @state()
    private filtermenu = [
        {
            text: "filter",
            children: [{ text: "Profile" }, { text: "Account" }, { text: "Preferences" }, { component: "hr" }, { text: "Sign out" }],
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

            section {
                background: #ecf8fa;
            }

            vaadin-list-box {
                font-weight: 200;
            }

            #addToWatch {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
            }

            #viewmodes {
                float: right;
                position: sticky;
                min-height: 30px;
            }

            vaadin-menu-bar {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-micro);
                border-bottom-left-radius: 2.4px;
                border-bottom-right-radius: 2.4px;
                border-collapse: collapse;
                border-top-left-radius: 2.4px;
                border-top-right-radius: 2.4px;
                font-size: 9.6px;
            }
            [role="menuitem"] {
                font-size: var(--lumo-font-size-micro);
            }

            span.bgDescription {
                font-size: var(--lumo-font-size-s);
                color: var(--divider-color);
                padding: 10px;
                font-family: "IBM Plex Sans", sans-serif;
                /* font-weight: 100; */
                position: absolute;
                top: 23%;
                left: 50%;
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
                top: 18%;
                left: 55%;
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
                z-index: -1;

                /* -webkit-transition: opacity 2s ease-in;
                -moz-transition: opacity 2s ease-in;
                -o-transition: opacity 2s ease-in;
                -ms-transition: opacity 2s ease-in;
                transition: opacity 2s ease-in; */
            }

            table tr,
            table td {
                transition: transform 0.35s ease-out;
                border-color: none;
                border-bottom-style: solid;
                border-bottom-width: 0px;
                padding-top: 8px;
                padding-bottom: 8px;
                text-align: center;
                vertical-align: middle;
            }

            table td span.title {
                color: black;
            }

            table th span.headerTitle {
                color: var(--secondary-text-color);
            }

            .happy {
                background-color: var(--lumo-success-color);
                color: white;
            }
        `,
    ];

    async firstUpdated() {
        const items_stocks: UserStock[] = [
            { symbol: "Price Target", companyName: "Sonos price has risen over the target 2354.", price: "$2345.2", status: "Available", priceChange: "2.33", noOfAlerts: 2, mood: true },
            { symbol: "SPCE", companyName: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", noOfAlerts: 10 },
            { symbol: "TSLA", logoUrl: "https://logo.clearbit.com/tesla.com", companyName: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { symbol: "MSFT", companyName: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", noOfAlerts: 1 },
            { symbol: "SONO", companyName: "Sonos", price: "$2345.2", status: "Available", priceChange: "2.33", noOfAlerts: 2 },
            { symbol: "SPCE", companyName: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", noOfAlerts: 10 },
            { symbol: "TSLA", companyName: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { symbol: "MSFT", companyName: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", noOfAlerts: 1, notification_types: ["email", "push"] },
            { symbol: "SPCE", companyName: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", noOfAlerts: 10 },
            { symbol: "TSLA", logoUrl: "https://logo.clearbit.com/tesla.com", companyName: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { symbol: "MSFT", companyName: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", noOfAlerts: 1 },
            { symbol: "SONO", companyName: "Sonos", price: "$2345.2", status: "Available", priceChange: "2.33", noOfAlerts: 2 },
            { symbol: "SPCE", companyName: "Virgin Galactic Holdings Inc, Blah Blah Blah Blah", price: "$15.24", priceChange: "-13", noOfAlerts: 10 },
            { symbol: "TSLA", companyName: "Tesla", price: "$1335.24", priceChange: "-2.37" },
            { symbol: "MSFT", companyName: "Microsoft Corp", price: "$3332.13", priceChange: "5.96", noOfAlerts: 1, notification_types: ["email", "push"] },
        ];
        this.items_stocks = items_stocks;
        //this.items_stocks = [];
    }

    private handleMinimalMode(e: Event) {
        this.minimalMode = e.detail.value == 0;
    }

    private alertsRenderer() {
        return html``;
    }

    private handleRowClick(e: Event, item: UserStock) {
        var event = new CustomEvent("row-clicked", { detail: { modalOpen: true, modalTitle: item.companyName, modalRenderer: this.alertsRenderer() } });
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                ${this.items_stocks?.length == 0
                    ? html`
                          <table class="yld0" id="wrapper">
                              <td><img id="bgImg" src="images/bg-activity.png" alt="" /></td>
                              <span class="bgHeader">No recent history. </span>
                              <span class="bgDescription">This timeline will be filled in automatically.</span>
                          </table>
                      `
                    : html`
                          <table class="yld0">
                              <thead>
                                  <tr>
                                      <th style="vertical-align: bottom;">
                                          <span class="headerTitle">Timeline of Activity</span>
                                      </th>
                                      <!-- 
                                      <vaadin-horizontal-layout id="viewmodes" style="align-items: right;" theme="spacing">
                                          <vaadin-list-box
                                              @selected-changed=${this.handleMinimalMode}
                                              style="position: sticky; font-size: var(--lumo-font-size-micro); margin: 0px;  float:right;"
                                              selected="0"
                                          >
                                              <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);"
                                                  >minimal mode</vaadin-item
                                              >
                                              <vaadin-item style="font-size: var(--lumo-font-size-micro);margin: 0px; padding: 3px; min-height:  var(--lumo-font-size-micro);">show more</vaadin-item>
                                          </vaadin-list-box>
                                      </vaadin-horizontal-layout> -->
                                      <vaadin-text-field
                                          id="searchfield"
                                          style="
                                        
                                            margin-left: auto;
                                            margin-right: auto;
                                            left: 0;
                                            right: 0;
                                            text-align: center;
                                            /* padding-left: 10%;
                                            padding-right: 200px; */
                                            width: 60%;
                                            "
                                          placeholder="filter"
                                          @keyup=${(e) => {
                                              //   console.log(e.srcElement.value);
                                              //   this.searchVal = e.srcElement.value;
                                              //   this.results = this.items_stock;
                                              //   this.query.variables = { name: this.searchVal };
                                          }}
                                          clear-button-visible
                                      >
                                          <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
                                      </vaadin-text-field>
                                  </tr>
                              </thead>

                              ${this.items_stocks?.map((item, index) => {
                                  return html`
                                      <tr role="row" index="${index}" @click=${(e) => this.handleRowClick(e, item)}>
                                          <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                                          <td style="width: 65%;">
                                              <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                                  <vaadin-avatar class="${item.mood ? "happy" : "sad"}" img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                                                  <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                      <span class="title">${item.symbol} </span>
                                                      <span class="companyName">${item.companyName}</span>
                                                      <!-- ${this.minimalMode ? html`` : html`<span style="font-size: 0.6em;">last triggered 4 mins ago</span>`} -->
                                                  </vaadin-vertical-layout>
                                              </vaadin-horizontal-layout>
                                          </td>

                                          <td style="width: 10%;">
                                              <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                  <span style="font-size: var(--lumo-font-size-tiny);">1 day ago</span>
                                                  <!-- <vaadin-button id="addToWatch">filter</vaadin-button> -->
                                                  <!-- <vaadin-menu-bar .items="${this.filtermenu}"></vaadin-menu-bar> -->
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

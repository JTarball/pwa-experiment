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

import { themeStyles } from "../themes/yld0-theme/styles.js";
import { UserStock } from "../store/models.js";
import { goPath } from "../router/index.js";

@customElement("alerts-home")
class YLD0AlertsHome extends LitElement {
    /* Properties, states etc. */
    @state()
    private minimalMode: Boolean = false;

    @state()
    private items_stocks?: UserStock[];

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
            }
        `,
    ];

    async firstUpdated() {
        const items_stocks: UserStock[] = [
            { symbol: "SONO", companyName: "Sonos", price: "$2345.2", priceNumber: 2345.2, status: "Available", priceChange: "2.33", noOfAlerts: 2 },
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
        goPath("/alerts/" + item.symbol, "?backurl=/alerts");

        // // Set the backurl event so that navigation can be modded
        // var event = new CustomEvent("backurl-changed", { detail: { backUrl: "/alerts" } });
        // this.dispatchEvent(event);
    }

    render() {
        return html`
            <!-- The main content is added / removed dynamically by the router -->
            <section>
                ${this.items_stocks?.length == 0
                    ? html`
                          <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                              <vaadin-button class="buttonAdd" @click=${this.handleAddAlert}>Add</vaadin-button>
                          </vaadin-vertical-layout>

                          <table id="wrapper">
                              <td><img id="bgImg" src="images/bg-alerts.png" alt="" /></td>
                              <span class="bgHeader">No alerts added yet. </span>
                              <span class="bgDescription">Click <em>Add</em> to add a stock to start adding alerts.</span>
                          </table>
                      `
                    : html`
                          <table>
                              <thead>
                                  <tr>
                                      <th style="vertical-align: bottom;">
                                          <span class="headerTitle">Alerts</span>
                                      </th>

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
                                      </vaadin-horizontal-layout>
                                  </tr>
                              </thead>

                              ${this.items_stocks?.map((item, index) => {
                                  return html`
                                      <tr role="row" index="${index}" @click=${(e) => this.handleRowClick(e, item)}>
                                          <!-- <td style="font-size: var(--lumo-font-size-xxs)">${item.date}</td> -->
                                          <td style="width: 65%;">
                                              <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                                  <vaadin-avatar img="${item?.logoUrl}" name="${item.symbol}" theme="xsmall"></vaadin-avatar>
                                                  <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                      <span class="stockSymbol">${item.symbol} </span>
                                                      <span class="companyName">${item.companyName}</span>
                                                      ${this.minimalMode ? html`` : html`<span style="font-size: 0.6em;">last triggered 4 mins ago</span>`}
                                                      <span style="font-size: 0.6em;"
                                                          >${item.noOfAlerts} ${item.noOfAlerts > 1 ? "alerts" : "alert"}
                                                          ${this.minimalMode
                                                              ? html``
                                                              : html` ${item.notification_types?.map((nt, index) => {
                                                                    var output = " ";
                                                                    if (index == 0) {
                                                                        output += "| ";
                                                                    }

                                                                    output += nt;

                                                                    return output;
                                                                })}`}</span
                                                      >
                                                  </vaadin-vertical-layout>
                                              </vaadin-horizontal-layout>
                                          </td>

                                          <td style="width: 10%;">
                                              <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                                  <vaadin-button id="addToWatch">Add to alerts</vaadin-button>
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

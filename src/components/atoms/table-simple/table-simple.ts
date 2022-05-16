import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { format } from "date-fns";

import "@vaadin/avatar";
import "@vaadin/item";
import "@vaadin/list-box";
import "@vaadin/select";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/text-field";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

// import "../organisms/y-table/y-table-pagination";

/**
 * Simple table with no footer, pagination etc to be used inside another element
 *
 * @param  {string}    title          -  Title for the container
 * @param  {Number}    width          -  Width of the container
 * @param  {Number}    height         -  Height of the container
 * @param  {Array}     headerCells    -  An array of objects describing how to construct the table
 * @param  {Array}     items          -  The raw table data
 * @param  {Number}    rowsPerPage    -  Number of rows per page (has a default)
 *
 *
 * Header Cell Examples
 * e.g. Template
 *
 *  template: (image_url, value) => {
 *    return html`<vaadin-avatar img="${image_url}" name="${value}" theme="xsmall"></vaadin-avatar>${value}`;
 *  },
 *  template_args: {
 *    image_url: "image_url",
 *    value: "name",
 *  },
 *
 */
@customElement("table-simple")
export class TableSimple extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: String })
    title = "";

    @property({ type: Number })
    width?;

    @property({ type: Number })
    height?;

    @property({ type: Array })
    headerCells: Array<Object> = [];

    @property({ type: Array })
    items = [];

    @property({ type: Boolean, reflect: true })
    noBorder: boolean = false;

    @property({ type: Boolean, reflect: true })
    noRowBorder: boolean = false;

    @property({ type: Boolean, reflect: true })
    noHeader: boolean = false;

    @state()
    items_no_sort = [];

    @property({ type: Number })
    rowsPerPage = 4;

    @state()
    skip = 0; // The skip number, used in pagination

    @state()
    results = [];

    // @state()
    // private items_select = [
    //     {
    //         label: "10",
    //         value: "recent",
    //     },
    //     {
    //         label: "20",
    //         value: "rating-desc",
    //     },
    //     {
    //         label: "50",
    //         value: "rating-asc",
    //     },
    //     {
    //         label: "100",
    //         value: "price-desc",
    //     },
    // ];

    @property({ type: Boolean, reflect: true })
    optionalFooter: boolean = false;

    @property({ type: Boolean, reflect: true })
    expanded: boolean = false;

    @property({ type: Boolean, reflect: true })
    overflow: boolean = false;

    @query("div.container")
    container: Element;

    // -- End of properties, queries etc. -- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            .container-wrapper {
                display: inline-block;
                margin: 0.1rem;
                margin-top: 1rem;
                width: 100%;
            }

            .container {
                /* min-width: 370px; */
                /* min-height: 450px; */
                border: 1px solid;
                border-color: var(--lumo-contrast-10pct);

                display: flex;
                flex-direction: column;

                -webkit-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -moz-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                -o-transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
                transition: width 0.6s ease-in-out, padding-left 0.6s ease-in-out, padding-right 0.6s ease-in-out;
            }

            :host([noBorder]) .container {
                border: none;
            }

            header {
                border-bottom: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                margin: 0.5rem;
                padding: 0.5rem;
            }

            span.title {
                padding-left: 10px;
                margin-bottom: 0rem;
                color: var(--lumo-contrast-color);
                font-size: var(--lumo-font-size-m);
                font-weight: 500;
                /* text-transform: uppercase; */
                padding-top: 14px;
            }

            table {
                padding: 1rem;
            }

            vaadin-select ([theme~="lemon"]) {
                font-size: var(--lumo-font-micro);
            }

            vaadin-select {
                font-size: var(--lumo-font-micro);
                width: 5rem;
            }
            #label-vaadin-select-1 {
                font-size: var(--lumo-font-micro);
            }

            /* Override table styling */
            table.yld0 {
                margin-top: 0;
                margin-bottom: 1rem;
                padding: 1rem;
                padding-right: 1rem;
                padding-bottom: 1rem;
                overflow: scroll;
            }

            .overflow {
                overflow: auto;
            }

            table th {
                position: -webkit-sticky; // this is for all Safari (Desktop & iOS), not for Chrome
                position: sticky;
                top: 0;
                z-index: 1; // any positive value, layer order is global
                background: #fff; // any bg-color to overlap
            }

            table tr,
            table td {
                text-align: left;
                font-size: 14px;
                padding-left: 12px;
                overflow: scroll;
            }

            :host([noRowBorder]) table tr,
            table td {
                border: none;
            }

            table tr[role="row"]:hover {
                background-color: var(--lumo-shade-5pct);
            }

            footer {
                padding: 0;
                background-color: #f7f7f9;
                border-top: 1px solid rgba(0, 0, 0, 0.125);
                min-width: 100%;
                /* push footer to bottom */
                margin-top: auto;
                /* ensure width includes padding */
                box-sizing: border-box;
            }

            #expandShrink {
                margin-left: auto;
            }

            /* visible content */

            .ellipsis_cell > div {
                position: relative;
                overflow: hidden;
                height: 1em;
            }

            .ellipsis_cell > div > span {
                display: block;
                position: absolute;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1em; /* for vertical align of text */
            }

            /* cell stretching content */
            .ellipsis_cell > div:after {
                content: attr(title);
                overflow: hidden;
                height: 0;
                display: block;
            }

            ::slotted(div[slot="topCorner"]) {
                margin-left: auto;
            }

            ::slotted(div[slot="preTable"]) {
                margin: 0.1rem;
            }

            .viewAllButton {
            }

            .iconViewAllButton {
                padding-top: 1px;
            }
        `,
    ];

    // -- Start of lifecycle methods -- //

    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
        if (this.width) {
            this.container.style.width = `${this.width}px`;
        } else {
            this.container.style.width = `100%`;
        }

        if (this.height) {
            this.container.style.height = `${this.height}px`;
        }
        console.log("danvir expanded", this.expanded);

        // Handle expanded
        if (this.expanded) {
            this.container.style.width = "700px";
        }
    }

    /**
     * Builds the template render based of the args and row data.
     * @param cell - the cell object
     * @param row - The row object for the current row.
     * @returns The template function is being called with the arguments from the template_args object.
     */
    _buildTemplate(template, template_args, row) {
        const args = [];
        Object.entries(template_args).forEach(([key, value]) => {
            if (key == "row") {
                args.push(row);
            } else {
                args.push(value in row ? row[value] : value);
            }
        });

        return template(...args);
    }

    handleRowClick(e: Event, row: Object, index: number) {
        var event = new CustomEvent("row-clicked", { detail: { row: row, index: index } });
        this.dispatchEvent(event);
    }

    /**
     * It takes the data and the header definition and combines them into a new array of objects.
     * @param items - The data to be formatted.
     * @param headerCells - an array of objects that define the header cells.
     * @returns The rows of data.
     */
    handleRowData(items, headerCells) {
        // Generate data using the header definition combined with the data

        // filter for the header cells if not be visible in non expanded version
        const hCells = headerCells.filter((c) => !(c.visible_only_when_expanded && !this.expanded));
        // const rows = items.filter((i, idx) => );
        //console.log('hCells', hCells)

        const args = [];
        items.map((row, index) => {
            const tds = [];

            headerCells.forEach(
                ({ id, template = null, template_args = {}, width_percentage, text_align, truncate_text, auto_truncate, visible_only_when_expanded, text_size, time_ago, date_format }) => {
                    const widthStyle = width_percentage ? `width: ${width_percentage}%;` : "width:10%;";
                    const textAlignStyle = "";
                    const textSizeStyle = text_size ? `font-size: ${text_size};` : "";

                    switch (true) {
                        case template !== null:
                            tds.push(html` <td style="${widthStyle} ${textAlignStyle} ${textSizeStyle}" class="ellipsis_cell">${this._buildTemplate(template, template_args, row)}</td> `);
                            break;
                        default:
                            tds.push(
                                html`
                                    <td style="${widthStyle} ${textAlignStyle} ${textSizeStyle}" class="ellipsis_cell">
                                        <div><span>${date_format ? html`${format(new Date(row[id]), "dd MMM yyyy")}` : html`${row[id]}`}</span></div>
                                    </td>
                                `
                            );
                            return;
                    }

                    //return row[id];
                }
            );
            args.push(
                html`
                    <tr
                        role="row"
                        index="${index}"
                        @click="${(e) => {
                            this.handleRowClick(e, row, index);
                        }}"
                    >
                        ${tds}
                    </tr>
                `
            );

            //return fmt_row;
        });
        return html` ${args.map((i) => html`${i}`)} `;
    }

    // -- Main Render -- //
    render() {
        this.results = this.items;
        console.log(this.items.length, "items length", "render", this.results);

        const headerCells = this.headerCells.filter((c) => !(c.visible_only_when_expanded && !this.expanded));

        const classes = {
            yld0: true,
            overflow: this.overflow,
        };

        return html`
            <div class="container-wrapper">
                <div class="container">
                    <!-- Main table data -->
                    <slot name="preTable"></slot>
                    <table class="${classMap(classes)}" style="padding-top: 0rem;">
                        ${this.noHeader
                            ? html`<thead style="opacity: 0;">
                                  <tr>
                                      <th style="width: 100%;" colspan="${this.headerCells.length}">adsa</th>
                                      <th style="width: 0%;"></th>
                                  </tr>
                              </thead>`
                            : html`
                                  <thead>
                                      <tr style="border-color: var(--lumo-contrast-10pct); border-bottom-style: solid; border-bottom-width: 1px;">
                                          ${headerCells.map((header, index) => {
                                              return html`
                                                  <th style="vertical-align: bottom; text-align: left; text-transform: uppercase; font-size: var(--lumo-font-size-m);">
                                                      <span>${header.label}</span>
                                                  </th>
                                              `;
                                          })}
                                      </tr>
                                  </thead>
                              `}

                        <tbody>
                            ${this.handleRowData(this.results, headerCells)}
                        </tbody>
                    </table>
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

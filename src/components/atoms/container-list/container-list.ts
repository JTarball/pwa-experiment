import { LitElement, html, css, render } from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { format, formatDistance } from "date-fns";

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
import { truncate } from "../../../helpers/utilities/helpers.js";

import "./container-search";
import "./sort-icon";
import "./container-pagination";

/**
 * Generic container for list
 *
 * @param  {string}    title          -  Title for the container
 * @param  {string}    subtitle       -  Subtitle for the container
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
@customElement("container-list")
export class ContainerList extends LitElement {
    // -- Start of state, properties, queries -- //

    @property({ type: String })
    title = "";

    @property({ type: String })
    subtitle = "";

    @property({ type: Number })
    width?;

    @property({ type: Number })
    height?;

    @property({ type: Array })
    headerCells: Array<Object> = [];

    @property({ type: Array })
    items = [];

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
    showExpandIcon: boolean = false;

    @property({ type: Boolean, reflect: true })
    overflow: boolean = false;

    @property({ type: Boolean, reflect: true })
    rowClickable: boolean = false;

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
            }

            .container {
                min-width: 370px;
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

            header {
                border-bottom: 1px solid;
                border-color: var(--lumo-contrast-10pct);
                padding: 1rem;
                margin: 1rem;
            }

            span.title {
                padding-right: 8px;
                margin-bottom: 0.2rem;
                color: var(--lumo-primary-text-color);
                font-size: var(--lumo-font-size-m);
                font-weight: 500;
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
            }

            .overflow {
                overflow: auto;
            }

            table tr,
            table td {
                /* text-align: left; */
                font-size: 11px;
                padding-top: 0;
                padding-bottom: 0;
            }

            table.rowClickable tr[role="row"],
            table.rowClickable td[role="row"] {
                cursor: pointer;
            }

            table.rowClickable tr[role="row"]:hover {
                background-color: var(--lumo-shade-5pct);
            }

            footer {
                padding: 0.75rem 1.25rem;
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
        `,
    ];

    // -- Start of lifecycle methods -- //

    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
        if (this.width) {
            this.container.style.width = `${this.width}px`;
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

            headerCells.forEach(({ id, template = null, template_args = {}, width_percentage, text_align, truncate_text, auto_truncate, visible_only_when_expanded, text_size, time_ago }) => {
                const widthStyle = width_percentage ? `width: ${width_percentage}%;` : "width:10%";
                const textAlignStyle = text_align ? `text-align: ${text_align};` : "text-align: left;";
                const textSizeStyle = text_size ? `font-size: ${text_size};` : "";

                switch (true) {
                    case id === "created_at":
                        if (time_ago) {
                            tds.push(
                                html`
                                    <td class="ellipsis_cell" style="${widthStyle} ${textAlignStyle} ${textSizeStyle}">
                                        <span>${formatDistance(new Date(row[id]), new Date(), { addSuffix: true })}</span>
                                    </td>
                                `
                            );
                        } else {
                            tds.push(
                                html`
                                    <td class="ellipsis_cell" style="${widthStyle} ${textAlignStyle} ${textSizeStyle}">
                                        <span>${format(new Date(row[id]), "dd MMM yyyy")}</span>
                                    </td>
                                `
                            );
                        }
                        break;
                    case template !== null:
                        tds.push(html` <td style="${widthStyle} ${textAlignStyle} ${textSizeStyle}" class="ellipsis_cell">${this._buildTemplate(template, template_args, row)}</td> `);
                        break;
                    default:
                        if (truncate_text && !this.expanded) {
                            tds.push(html` <td style="${widthStyle} ${textAlignStyle} ${textSizeStyle}">${truncate(row[id], truncate_text)}</td> `);
                        } else if (auto_truncate) {
                            tds.push(
                                html`
                                    <td style="${widthStyle} ${textAlignStyle} ${textSizeStyle}" class="ellipsis_cell">
                                        <div><span>${row[id]}</span></div>
                                    </td>
                                `
                            );
                        } else {
                            tds.push(html` <td style="${widthStyle} ${textSizeStyle}">${row[id]}</td> `);
                        }
                        return;
                }

                //return row[id];
            });
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

    handleExpandShrink() {
        if (this.expanded) {
            this.container.style.width = `${this.width}px`;
            this.expanded = !this.expanded;
        } else {
            this.container.style.width = "700px";
            this.expanded = !this.expanded;
        }
    }

    /**
     * Sort the results array by the column specified by the header
     * @param asc - boolean, true if ascending, false if descending
     * @param header - The header object that we want to sort by.
     */
    handleSortColumn(asc, header) {
        // Hack for no sort: We assume no sort is before descend (asc = false)
        // we store it so when no sort we can restore the order.
        if (asc == undefined) {
            this.items = this.items_no_sort;
            this.requestUpdate();
            return;
        }

        if (!asc && asc != undefined) {
            this.items_no_sort = this.items;
        }

        const sorted = this.items.slice().sort((a, b) => {
            let fa, fb;
            if (header.sort_id) {
                if (typeof a[header.sort_id] == "number") {
                    fa = a[header.sort_id];
                    fb = b[header.sort_id];
                } else {
                    fa = a[header.sort_id]?.toLowerCase();
                    fb = b[header.sort_id]?.toLowerCase();
                }
            } else {
                fa = a[header.id]?.toLowerCase();
                fb = b[header.id]?.toLowerCase();
            }

            if (asc == undefined) {
                return 0;
            }

            if (fa < fb) {
                return asc ? 1 : -1;
            }

            if (fa > fb) {
                return asc ? -1 : 1;
            }

            return 0;
        });

        this.items = [...sorted];
        this.requestUpdate();
    }

    // private renderer = (root: HTMLElement) => {
    //     render(
    //         html`
    //             <vaadin-list-box>
    //                 ${this.items_select.map(
    //                     (item) => html`
    //                         <vaadin-item value="${item.value}">
    //                             <div style="display: flex; align-items: center;">
    //                                 <div>${item.label}</div>
    //                             </div>
    //                         </vaadin-item>
    //                     `
    //                 )}
    //             </vaadin-list-box>
    //         `,
    //         root
    //     );
    // };

    // -- Main Render -- //
    render() {
        this.results = this.items.slice(this.skip, this.skip + this.rowsPerPage);
        console.log(this.items.length, "items length", "render", this.results);

        const headerCells = this.headerCells.filter((c) => !(c.visible_only_when_expanded && !this.expanded));

        const classes = {
            yld0: true,
            overflow: this.overflow,
            rowClickable: this.rowClickable,
        };

        return html`
            <div class="container-wrapper">
                <div class="container">
                    <header>
                        <vaadin-horizontal-layout>
                            <vaadin-vertical-layout>
                                <span class="title">${this.title}</span>
                                <span class="description">${this.subtitle}</span>
                            </vaadin-vertical-layout>
                            ${this.showExpandIcon
                                ? html` <vaadin-button id="expandShrink" @click=${this.handleExpandShrink} theme="icon" aria-label="Expand width">
                                      <vaadin-icon style="transform: rotate(45deg);" icon="${this.expanded ? "vaadin:compress" : "vaadin:expand"}"></vaadin-icon>
                                  </vaadin-button>`
                                : html`<slot name="topCorner"></slot>`}
                        </vaadin-horizontal-layout>
                        <slot name="header"></slot>
                    </header>

                    <!-- Main table data -->
                    <slot name="preTable"></slot>
                    <table class="${classMap(classes)}" style="padding-top: 0rem;">
                        <thead>
                            <tr style="border-color: var(--lumo-contrast-10pct);border-bottom-style: solid;border-bottom-width: 1px;">
                                ${headerCells.map((header, index) => {
                                    const textAlignStyle = header.header_text_align ? `text-align: ${header.header_text_align};` : "";

                                    return html`
                                        <th style="vertical-align: bottom; ${textAlignStyle}">
                                            <span>${header.label}</span>
                                            ${header.noSort
                                                ? html``
                                                : html`<span
                                                      ><sort-button
                                                          @sort-changed=${(e) => {
                                                              console.log("sort-changed", e);
                                                              const asc = e.detail.asc;
                                                              this.handleSortColumn(asc, header);
                                                          }}
                                                      ></sort-button
                                                  ></span>`}
                                        </th>
                                    `;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            ${this.handleRowData(this.results, headerCells)}
                        </tbody>
                    </table>
                    <slot></slot>
                    ${this.rowsPerPage >= this.items.length && this.optionalFooter
                        ? html``
                        : html`
                            <footer>
                                <vaadin-horizontal-layout style="align-items: center; text-align: center;" theme="spacing"></vaadin-horizontal-layout>
                                    
                                    <container-pagination
                                        @previous=${() => {
                                            this.skip -= this.rowsPerPage;
                                        }}
                                        @next=${() => {
                                            this.skip += this.rowsPerPage;
                                        }}
                                        .rows="${this.rowsPerPage}"
                                        .skip="${this.skip}"
                                        .total="${this.items.length}"
                                    ><slot name="footer"></slot></container-pagination>
                                </vaadin-horizontal-layout>
                            </footer>
                    `}
                </div>
            </div>
        `;
    }
}

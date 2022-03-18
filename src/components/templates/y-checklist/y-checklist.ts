/* Add/Edit Checklist Modal */
import { LitElement, html, css, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { guard } from "lit/directives/guard.js";

import { ApolloMutationController } from "@apollo-elements/core/apollo-mutation-controller";

import "@vaadin/dialog";
import "@vaadin/horizontal-layout";
import "@vaadin/vertical-layout";
import "@vaadin/form-layout";
import "@vaadin/menu-bar";
import { FormLayoutResponsiveStep } from "@vaadin/form-layout";
import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";

import "../../atoms/input/input"; // text-input
import "../../atoms/toggle-group/toggle-group";
import "../../atoms/notification/notification";
import "../../molecules/container-card-info/container-card-info";
import "../../molecules/multiple-choice/multiple-choice";
import "../../organisms/modal-up/modal-up";
import { AddChecklist } from "../../../graphql/mutations/AddChecklist.mutation.graphql.js";
import { UpdateChecklist } from "../../../graphql/mutations/UpdateChecklist.mutation.graphql.js";
import { GetChecklists } from "../../../graphql/queries/GetChecklists.query.graphql.js";

/**
 * Checklist modal template for adding new checklist or editing existing
 */
@customElement("y-checklist")
export class Checklist extends LitElement {
    /* Properties */

    @property({ type: Boolean, reflect: false })
    open: boolean = false;

    // add - If you want a brand new checklist, else we expect an update and pass through existing state
    @property({ type: Boolean, reflect: true })
    add: boolean = false; //

    // -- Checklist state for saving -- //

    @property({ type: Object })
    checklist?: Object;

    // ------ End of checklist state ---- //

    @state()
    disableSubmit: boolean = true;

    // -- Dialog -- //

    @state()
    dialogOpened = false;

    // ---- Generic Notification --- //

    @state()
    notificationOpened = false;

    @state()
    notificationText: string = "";

    // --- End of Notification --- //

    mutation_add_checklist = new ApolloMutationController(this, AddChecklist);
    mutation_update_checklist = new ApolloMutationController(this, UpdateChecklist);

    // --- End of properties, queries etc. --- //

    static styles = [
        badge,
        utility,
        spacing,
        themeStyles,
        css`
            /* Layout */

            .container {
                justify-content: space-between;
                display: flex;
                flex-direction: row;
            }

            .mainBar {
                flex: 1 1 auto;
                padding: 1rem;
                width: 50%;
            }

            .sideBar {
                min-height: 100vh;
                flex-shrink: 1;
                width: 80px;
                border-right: 1px solid rgba(230, 230, 230, 1);
            }
            container-card-info {
                display: none;
            }

            @media (min-width: 1280px) {
                section {
                    max-width: 1280px;
                }
                .sideBar {
                    min-height: 100vh;
                    flex-shrink: 1;
                    width: 400px;
                    border-right: 1px solid rgba(230, 230, 230, 1);
                }
                container-card-info {
                    display: block;
                }
            }

            @media (min-width: 1280px) {
                section {
                    max-width: 1280px;
                }
                .sideBar {
                    min-height: 100vh;
                    flex-shrink: 1;
                    width: 400px;
                    border-right: 1px solid rgba(230, 230, 230, 1);
                }
            }

            /* Table */
            tr {
                cursor: pointer;
            }

            table th span.headerTitle {
                color: var(--lumo-contrast);
            }
            table th span.headerDescription {
                font-family: var(--lumo-font-family);
                color: var(--lumo-secondary-text-color);
                font-size: var(--lumo-font-size-micro);
                padding: 1em;
            }

            /* End of Table */

            .addItem {
                background-color: var(--lumo-contrast-30pct);
                position: sticky;
                cursor: pointer;
                margin: 5rem 1rem;
                width: 40px;
                float: right;
            }

            .questionText {
                background-color: blue;
            }

            /* Layout styling for checklist UI */
        `,
    ];

    // -- Lifecycle functions -- //
    update(changedProperties: PropertyValues) {
        this.validate();
        super.update(changedProperties);
    }

    // -- Handlers -- //
    handleAddItem(option: string) {
        // We need to set the fields, so that optional fields are set
        // when saving e.g. description
        console.log("handleAddItem", this.checklist);
        if (this.checklist == undefined) {
            this.checklist = { name: "", description: "", checklist: [] };
        }
        if (this.checklist?.description == undefined) {
            this.checklist.description = "";
        }
        if (this.checklist?.checklist == undefined) {
            this.checklist.checklist = [];
        }

        let checklists;

        switch (option) {
            case "Question Text":
                checklists = [...this.checklist.checklist, { type: "question", title: "", info: "" }];
                this.checklist.checklist = checklists;
                break;
            case "Yes/No":
                checklists = [
                    ...this.checklist.checklist,
                    {
                        type: "boolean",
                        title: "",
                        info: "",
                        choices: [
                            { id: "YES", label: "Yes", selected: true, background_color: "var(--lumo-success-color)" },
                            { id: "NO", label: "No", selected: false, background_color: "var(--lumo-error-color)" },
                        ],
                    },
                ];
                this.checklist.checklist = checklists;
                break;
            case "Multiple Choice":
                checklists = [
                    ...this.checklist.checklist,
                    {
                        type: "multiple",
                        title: "",
                        info: "",
                        choices: [
                            { id: "A", label: "A", selected: true }, // if you change this remember to adjust this.repeated
                            { id: "B", label: "B", selected: false },
                            { id: "C", label: "C", selected: false },
                            { id: "D", label: "D", selected: false },
                        ],
                    },
                ];
                this.checklist.checklist = checklists;
                break;
            default:
        }
        this.validate();
    }

    async handleMenuAction(e: Event, index: number) {
        console.log("handleMenuAction", index, e, this.checklist);
        const item = this.checklist.checklist[index];

        var move = function (array, element, delta) {
            var index = array.indexOf(element);
            console.debug(`move() index, ${index}`);
            var newIndex = index + delta;
            if (newIndex < 0 || newIndex == array.length) return; //Already at the top or bottom.
            var indexes = [index, newIndex].sort(); //Sort the indixes
            array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
            console.log(array);
        };

        var moveUp = function (array, element) {
            move(array, element, -1);
        };

        var moveDown = function (array, element) {
            move(array, element, 1);
        };

        const value = e.detail.value;

        if (value.text == "Delete") {
            var checklist_items = this.checklist.checklist.filter(function (el, idx) {
                return idx != index;
            });
            this.validate();
            this.checklist = { ...this.checklist, checklist: checklist_items };
        } else if (value.text == "Duplicate") {
            let checklist_items = [...this.checklist.checklist, item];
            this.checklist = { ...this.checklist, checklist: checklist_items };
        } else if (value.text == "Move Up") {
            let checklist_items = [...this.checklist.checklist];
            moveUp(checklist_items, item);
            this.checklist = { ...this.checklist, checklist: checklist_items };
        } else if (value.text == "Move Down") {
            let checklist_items = [...this.checklist.checklist];
            moveDown(checklist_items, item);
            this.checklist = { ...this.checklist, checklist: checklist_items };
        }
    }

    async handleSubmit(e: Event) {
        if (this.add) {
            await this.handleSaveAdd(e);
        } else {
            await this.handleUpdate(e);
        }
    }

    async handleSaveAdd(e: Event) {
        var { data, error, loading } = await this.mutation_add_checklist.mutate({
            variables: {
                name: this.checklist?.name,
                description: this.checklist.description,
                checklist: this.checklist.checklist,
            },
            refetchQueries: () => [
                {
                    query: GetChecklists,
                },
            ],
        });

        if (error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `${error}`;
        } else if (!error && !loading) {
            this.notificationOpened = true;
            this.notificationText = `Added checklist '${this.checklist?.name}'`;
            this.handleClose();
        }
    }

    async handleUpdate(e: Event) {
        console.log("handleUpdate,", this.checklist);
        if (this.checklist.uuid) {
            var { data, error, loading } = await this.mutation_update_checklist.mutate({
                variables: {
                    uuid: this.checklist?.uuid,
                    name: this.checklist?.name,
                    description: this.checklist.description,
                    checklist: this.checklist.checklist,
                },
                update: (store, {}) => {
                    // Read the data from the cache for this query.
                    const dataQ = store.readQuery({
                        query: GetChecklists,
                    });

                    let items = dataQ?.checklists.items.map((i) => {
                        if (i.uuid !== this.checklist.uuid) {
                            return i;
                        }
                        return this.checklist;
                    });

                    const update = { ...dataQ, checklists: { ...dataQ.checklists, items } };

                    console.log("mutation update, ", update);

                    // Write the data back to the cache.
                    store.writeQuery({ query: GetChecklists, data: update });
                },
            });

            if (error && !loading) {
                this.notificationOpened = true;
                this.notificationText = `${error}`;
            } else if (!error && !loading) {
                this.notificationOpened = true;
                this.notificationText = `Update checklist '${this.checklist?.name}'`;
                this.handleClose();
            }
        } else {
            this.notificationOpened = true;
            this.notificationText = `Failed to save checklist - can't confirm uuid`;
        }
    }

    validate() {
        this.disableSubmit = this.checklist?.name && this.checklist?.checklist?.length > 0 ? false : true;
    }

    handleClose() {
        // Close modal
        this.open = false;
    }

    // -- Other Renders -- //

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        { minWidth: 0, columns: 1 },
        { minWidth: "20em", columns: 1 },
    ];

    private _createItem() {
        const item = document.createElement("vaadin-context-menu-item");
        const icon = document.createElement("vaadin-icon");
        item.setAttribute("aria-label", "Other save options");
        icon.setAttribute("icon", `vaadin:ellipsis-dots-v`);
        item.appendChild(icon);
        return item;
    }

    renderMenu(index: number) {
        var items = [
            {
                component: this._createItem(),
                children: [
                    { text: "Move Up", disabled: index == 0 },
                    { text: "Move Down", disabled: index >= this.checklist.checklist.length - 1 },
                    { component: "hr" },
                    { text: "Duplicate" },
                    { text: "Delete" },
                ],
            },
        ];
        return html` <vaadin-menu-bar style="z-index: -1;" theme="icon" .items="${items}" @item-selected=${async (e) => this.handleMenuAction(e, index)}></vaadin-menu-bar>`;
    }

    private renderRow(item, index) {
        switch (item.type) {
            case "question":
                return html`
                    <tr role="row" index="${index}">
                        <td style="width: 99%;">
                            <text-input
                                value="${item.title}"
                                theme="no-border big"
                                placeholder="Type your Question here"
                                backgroundColor="#F3F6F9"
                                @on-change=${(e) => {
                                    let update = this.checklist.checklist.map((element, i) => (i == index ? { ...element, title: e.detail.value } : element));
                                    let checklist = { ...this.checklist, checklist: update };
                                    this.checklist = checklist;
                                }}
                            ></text-input>
                            <text-area
                                theme="no-border no-focus-border"
                                label="Information/Help"
                                placeholder="Optional: Add any contextual information to further add any clarity to your question."
                                value="${item.info}"
                                @on-change=${(e) => {
                                    let update = this.checklist.checklist.map((element, i) => (i == index ? { ...element, info: e.detail.value } : element));
                                    let checklist = { ...this.checklist, checklist: update };
                                    this.checklist = checklist;
                                }}
                                style="margin-top: 2rem;"
                            ></text-area>
                        </td>
                        <td style="width: 1%;">${this.renderMenu(index)}</td>
                    </tr>
                `;
                break;
            case "boolean":
                return html`
                    <tr role="row" index="${index}">
                        <td style="width: 99%;">
                            <text-input
                                value="${item.title}"
                                label="Yes/No"
                                theme="no-border big"
                                placeholder="Type your Yes/No Question here"
                                backgroundColor="#F3F6F9"
                                @on-change=${(e) => {
                                    let update = this.checklist.checklist.map((element, i) => (i == index ? { ...element, title: e.detail.value } : element));
                                    let checklist = { ...this.checklist, checklist: update };
                                    this.checklist = checklist;
                                }}
                            ></text-input>
                            <text-area
                                theme="no-border no-focus-border"
                                label="Information/Help"
                                placeholder="Optional: Add any contextual information to further add any clarity to your question."
                                value="${item.info}"
                                @on-change=${(e) => {
                                    let update = this.checklist.checklist.map((element, i) => (i == index ? { ...element, info: e.detail.value } : element));
                                    let checklist = { ...this.checklist, checklist: update };
                                    this.checklist = checklist;
                                }}
                                style="margin-top: 2rem;"
                            ></text-area>
                            <toggle-group label="Preview Answer" .items=${item.choices}></toggle-group>
                        </td>

                        <td style="width: 1%;">${this.renderMenu(index)}</td>
                    </tr>
                `;
                break;
            case "multiple":
                return html`
                    <tr role="row" index="${index}">
                        <td style="width: 99%;">
                            <text-input
                                value="${item.title}"
                                label="Multiple Choice"
                                theme="no-border big"
                                placeholder="Type your Multiple Choice Question here"
                                backgroundColor="#F3F6F9"
                                @on-change=${(e) => {
                                    let update = this.checklist.checklist.map((element, i) => (i == index ? { ...element, title: e.detail.value } : element));
                                    let checklist = { ...this.checklist, checklist: update };
                                    this.checklist = checklist;
                                }}
                            ></text-input>
                            <text-area
                                theme="no-border no-focus-border"
                                label="Information/Help"
                                placeholder="Optional: Add any contextual information to further add any clarity to your question."
                                value="${item.info}"
                                @on-change=${(e) => {
                                    let update = this.checklist.checklist.map((element, i) => (i == index ? { ...element, info: e.detail.value } : element));
                                    let checklist = { ...this.checklist, checklist: update };
                                    this.checklist = checklist;
                                }}
                                style="margin-top: 2rem;"
                            ></text-area>
                            <multiple-choice
                                .multiple_choice=${item.choices}
                                @on-change=${(e) => {
                                    console.log("before,", this.checklist);
                                    let update = this.checklist.checklist.map((element, i) => (i == index ? { ...element, choices: e.detail.value } : element));
                                    this.checklist = { ...this.checklist, checklist: update };
                                    console.log("after, ", this.checklist, update);
                                }}
                            ></multiple-choice>
                        </td>
                        <td style="width: 1%;">${this.renderMenu(index)}</td>
                    </tr>
                `;
                break;
            default:
                return html``;
        }
    }

    private renderForm() {
        return html`
            <div class="container">
                <!-- Side Power Menu -->
                <div class="sideBar">
                    <div
                        class="addItem"
                        @click="${() => {
                            this.dialogOpened = true;
                        }}"
                    >
                        <vaadin-button theme="icon" aria-label="Add item" style="padding: 0.5rem;">
                            <vaadin-icon icon="vaadin:plus"></vaadin-icon>
                        </vaadin-button>
                    </div>
                    <container-card-info uniqId="checklist-info">
                        <h4 style="margin-bottom: 2rem; color: var(--lumo-secondary-text-color); font-weight: 400;">
                            Checklists are a powerful tool to confirm your investment strategy. Once created, you can run them as a template by adding to your Notes.
                            <p>Running them will not only take emotion out of your decision making but confirm you have done your due diligence.</p>
                            <p>Checklists can be used to for example:</p>
                            <ul style="color: var(--lumo-secondary-text-color); font-weight: 400;">
                                <li>Check whether a stock is suitable for investment</li>
                                <li>Periodic analysis where you can confirm how the stock is changing over time.</li>
                            </ul>
                        </h4>
                    </container-card-info>
                </div>
                <!-- Main Content -->
                <div class="mainBar">
                    ${this.checklist?.checklist?.length == 0 || this.checklist?.checklist == undefined
                        ? html`
                              <div style="text-align: center;">
                                  <span style="margin-left: auto; color: var(--lumo-secondary-text-color); font-size: var(--lumo-font-size-micro);"
                                      >Please add at least one free-text, yes/no or multiple choice questions to create a checklist. Click on + .</span
                                  >
                              </div>
                          `
                        : html``}

                    <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}">
                        <text-input
                            startFocused
                            id="name"
                            theme="no-border big no-focus-border"
                            @on-change=${(e) => {
                                let name = e.detail.value;
                                this.checklist = { ...this.checklist, name };
                                this.validate();
                            }}
                            label="Name"
                            value=${this.checklist?.name}
                            placeholder=""
                        ></text-input>
                        <text-area
                            theme="no-border no-focus-border"
                            placeholder="Optional: Description of the checklist"
                            label="Description"
                            value=${this.checklist?.description}
                            @on-change=${(e) => {
                                let description = e.detail.value;
                                this.checklist = { ...this.checklist, description };
                            }}
                        ></text-area>

                        <table class="yld0" style="margin-bottom: 0px; padding-bottom: 1rem;">
                            <thead>
                                <tr style="border-color: var(--lumo-contrast-10pct);border-bottom-style: solid;border-bottom-width: 1px;"></tr>
                            </thead>
                            <tr style="border: none;"></tr>

                            ${this.checklist?.checklist?.map((item, index) => {
                                return html`${this.renderRow(item, index)}`;
                            })}
                        </table>
                        <div style="padding-right: 10em;">
                            <vaadin-button theme="primary contrast" style="float: right;" ?disabled=${this.disableSubmit} @click=${this.handleSubmit}>${this.add ? "Save" : "Update"}</vaadin-button>
                        </div>
                    </vaadin-form-layout>
                </div>
            </div>
        `;
    }

    // -- Main Render -- //
    render() {
        console.log("checklist-modal, render", this.checklist);

        const title = this.checklist ? `Edit '${this.checklist?.name}'` : "New checklist";

        return html`
            <modal-up
                ?open=${this.open}
                title=${title}
                @closed=${(e) => {
                    const closed = new CustomEvent("closed", {
                        detail: {
                            value: false,
                        },
                    });
                    this.dispatchEvent(closed);
                }}
                ><section>${this.renderForm()}</section>
            </modal-up>

            <!-- Vaadin Dialog -->
            <vaadin-dialog
                aria-label="Add note"
                draggable
                .opened="${this.dialogOpened}"
                @opened-changed="${(e: CustomEvent) => {
                    this.dialogOpened = e.detail.value;
                }}"
                .renderer="${guard([], () => (root: HTMLElement) => {
                    const items = [
                        { name: "Question Text", className: "questionText", icon: "vaadin:list-ol" },
                        { name: "Yes/No", className: "yesNo", icon: "vaadin:adjust" },
                        { name: "Multiple Choice", className: "multChoice", icon: "vaadin:options" },
                    ];

                    render(
                        html`
                            <style>
                                ul {
                                    list-style: none;
                                    list-style-type: none;
                                    padding-inline-start: 10px;
                                    cursor: pointer;
                                }

                                ul li:hover {
                                    background-color: var(--lumo-contrast-20pct);
                                }

                                .itemName {
                                    font-size: var(--lumo-font-size-xs);
                                    padding: 0.5rem;
                                }

                                .questionText {
                                    font-size: 0.7em;
                                    color: var(--lumo-primary-color-50pct);
                                }

                                .yesNo {
                                    font-size: 0.7em;
                                    color: var(--lumo-contrast-40pct);
                                }

                                .multChoice {
                                    font-size: 0.7em;
                                    color: var(--lumo-contrast);
                                }
                            </style>

                            <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                <h3>choice</h3>
                                <ul>
                                    ${items.map((item, index) => {
                                        return html`
                                            <li
                                                class="itemName"
                                                @click="${() => {
                                                    this.handleAddItem(item.name);
                                                    this.dialogOpened = false;
                                                }}"
                                            >
                                                <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                                    <vaadin-icon class="${item.className}" icon="${item.icon}"></vaadin-icon>
                                                    <span class="itemName">${item.name}</span>
                                                </vaadin-horizontal-layout>
                                            </li>
                                        `;
                                    })}
                                </ul>
                            </vaadin-horizontal-layout>
                        `,
                        root
                    );
                })}"
            ></vaadin-dialog>

            <!-- notification -->
            <generic-notification
                ?opened=${this.notificationOpened}
                .text="${this.notificationText}"
                @opened-changed="${(e) => {
                    this.notificationOpened = e.detail.value;
                }}"
            ></generic-notification>
        `;
    }
}

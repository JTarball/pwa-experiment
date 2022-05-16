// Inspired by https://codepen.io/plem/details/XxrKae
// and https://www.cssscript.com/expanding-search-box/

import { LitElement, html, css, render } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import Fuse from "fuse.js";

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
//import { Notification } from "@vaadin/notification";
import { NotificationRenderer, NotificationOpenedChangedEvent } from "@vaadin/notification";
import type { RouterLocation } from "@vaadin/router";

import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";

import { themeStyles } from "../../../themes/yld0-theme/styles.js";
import { goPath } from "../../../router/index.js";

//import { GetStocks } from "./Stocks.query.graphql";
//import { AddFollow } from "./AddFollow.mutation.graphql.js";
//import { getClient } from "../../store/client";

import data from "./menu-search.json" assert { type: "json" };

@customElement("search-in-stock")
class SearchInStock extends LitElement {
    /* Properties, states, mixins etc. */

    @property()
    companyName: String;

    @state()
    searchVal: String = "";

    @query("#searchleft")
    search;

    @query("#valueToSearchFor")
    txtInput;

    @query("#result")
    containerResult;

    @query("#tagSelected")
    containerTag;

    @query("#ValueToSearchForForm")
    form;

    // -- Fuse Object -- //
    fuse: Object;

    // -- Fuse Options -- //

    options = {
        keys: ["name", "tags"],
        threshold: 0.0,
        includeScore: true,
    };

    // query = new ApolloQueryController(this, GetStocks, {
    //     variables: {
    //         name: this.searchVal,
    //     },
    // });

    //addFollow = new ApolloMutationController(this, AddFollow);

    @state()
    private items_recent?: UserStock[];

    @state()
    results: Array = [];

    res: Array = [];

    /* End of properties, states ... */

    static styles = [
        // badge,
        // utility,
        // spacing,
        // themeStyles,
        css`
            * {
                box-sizing: border-box;
            }

            .container {
                max-width: 360px;
                margin: 0 auto 0;
                text-align: center
                padding: 5% 5% 0;
            }

            .tagSelected span {
                background-color: #52a7ec;
                color: #fff;
                padding: 5px 8px;
                border-radius: 3px;
                margin: 5px;
                display: inline-block;
            }

            .valueToSearchFor {
                width: 0;
                height: 44px;
                padding: 8px 5%;
                font-size: 22px;
                border-radius: 3px;
                background-color: #eee;
                border: 0;
                box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
                transition: box-shadow 0.2s ease-in-out;
                margin-left: 10px;
            }

            .valueToSearchFor::-webkit-input-placeholder {
                font-size: var(--lumo-font-size-s);
            }

            /* .valueToSearchFor:hover {
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.16);
            } */

            #resultWrapper {
                /* make it display on top of other elements and not push them down */
                position: absolute;
                top: 0;
                left: 0px;
                z-index: 9000;
                width: 300px;
            }

            .result {
                background-color: var(--lumo-base-color);
                border-color: var(--lumo-contrast-10pct);
                /* border-bottom-style: solid;
                border-bottom-width: 1px; */
                box-shadow: 0 1px 10px rgb(0 0 0 / 20%);
            }

            .result > div {
                position: relative;
                cursor: pointer;
                padding: 5px 5%;
            }

            .result > div:hover {
                background-color: #eee;
            }

            .removeTag {
                cursor: pointer;
                padding: 1px 6px;
                margin-left: 8px;
                border: 1px solid #fff;
                border-radius: 3px;
                opacity: 0.6;
                transition: opacity 0.2s linear;
            }

            .removeTag:hover {
                opacity: 1;
            }

            .containerValueToSearchFor {
                position: relative;
            }

            .button-submit {
                position: absolute;
                top: 0;
                right: 0;
                width: 44px;
                height: 44px;
                cursor: pointer;
                /* background: url("https://raw.githubusercontent.com/filippo-quacquarelli/tag-search/master/search.png") center center no-repeat; */
                z-index: 10;
                background-color: transparent;
                border: 0;
                text-indent: -999px;
            }

            /* #ValueToSearchForForm {
                margin-left: auto;
            } */

            /* Search results styling */

            .resultBox {
                border-color: var(--lumo-contrast-10pct);
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding-top: 8px;
                padding-bottom: 8px;
                text-align: left;
                vertical-align: middle;
            }

            .resultName {
                font-size: var(--lumo-font-size-tiny);
                color: var(--lumo-contrast);
                padding: 0;
                text-align: left;
                font-weight: 500;
            }

            .resultDescription {
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
            }


            /* Search with Expand Functionality */
            .button {
                display: inline-block;
                margin: 4px 2px;
                background-color: var(--lumo-contrast);
                font-size: 14px;
                padding-left: 32px;
                padding-right: 32px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: white;
                text-decoration: none;
                cursor: pointer;
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
                border-radius: 2.8px;
            }

.button:hover {
	transition-duration: 0.4s;
	-moz-transition-duration: 0.4s;
	-webkit-transition-duration: 0.4s;
	-o-transition-duration: 0.4s;
	background-color: white;
	color: black;
}

.search-container {
	position: relative;
	display: inline-block;
	margin: 4px 2px;
	height: 30px;
	width: 30px;
	vertical-align: bottom;
}

.mglass {
	display: inline-block;
	pointer-events: none;
	-webkit-transform: rotate(-45deg);
	-moz-transform: rotate(-45deg);
	-o-transform: rotate(-45deg);
	-ms-transform: rotate(-45deg);
}

.searchbutton {
	position: absolute;
	font-size: 18px;
	width: 100%;
	margin: 0;
	padding: 0;
}

.search:focus + .searchbutton {
	transition-duration: 0.4s;
	-moz-transition-duration: 0.4s;
	-webkit-transition-duration: 0.4s;
	-o-transition-duration: 0.4s;
	background-color: white;
	color: black;
}

.search {
	position: absolute;
	left: 49px; /* Button width-1px (Not 50px/100% because that will sometimes show a 1px line between the search box and button) */
	background-color: white;
	outline: none;
	border: none;
	padding: 0;
	width: 0;
	height: 100%;
	z-index: 10;
	transition-duration: 0.4s;
	-moz-transition-duration: 0.4s;
	-webkit-transition-duration: 0.4s;
	-o-transition-duration: 0.4s;
}

.search:focus, .search:hover {
	width: 250px; /* Bar width+1px */
	padding: 0 16px 0 0;
}

.expandright {
	left: auto;
	right: 49px; /* Button width-1px */
}

.expandright:focus {
	padding: 0 0 0 16px;
}

        `,
    ];

    firstUpdated() {
        // var request = new XMLHttpRequest();
        // request.open("GET", "https://filippoquacquarelli.it/tag-search/tag.json", true);
        // request.onload = function (this) {
        //     if (request.status >= 200 && request.status < 400) {
        //         if (typeof Storage !== "undefined") localStorage.setItem("tag", JSON.stringify(request.response));
        //         this.launchSearch(request.response);
        //     }
        // };
        // request.onerror = function () {};
        // if (localStorage.getItem("tag") == null) request.send();
        // else this.launchSearch(JSON.parse(localStorage.getItem("tag")));
        this.launchSearch(data);
        console.log("danvir", data);
        //console.log(JSON.stringify(data));
    }

    private launchSearch(data) {
        this.fuse = new Fuse(data, this.options);

        console.log("fuse", typeof this.fuse);

        console.log(this.containerResult, "containerResult");

        // this.txtInput.onkeyup = function (e, this) {};
    }

    // private isSelectTag() {
    //     if (this.containerTag.childNodes.length == 0) return false;

    //     return true;
    // }

    // private isDuplicateTag(tag) {
    //     var getTag = this.getSelectedTag();
    //     if (!getTag) return false;

    //     return getTag.some(function (item) {
    //         return tag === item;
    //     });
    // }

    handleKeyUp(e: Event) {
        // this.results.push({ name: "asdsa" });
        // this.results.push({ name: "asdsa" });

        this.containerResult.innerText = "";

        if (e.srcElement.value.length <= 1) return;

        const results = this.fuse.search(e.target.value);
        console.log(results, typeof results);
        console.log(Array.from(results), typeof Array.from(results));

        this.res = [];
        Array.from(results).forEach((result: Element, i) => {
            const item = result.item;
            this.res.push(item);
        });

        console.log("results", this.res);

        this.results = this.res;

        // Array.from(results).forEach((result: Element, i) => {
        //     var inputElement = document.createElement("div");

        //     const item = result.item;

        //     inputElement.innerText = item.name;
        //     inputElement.dataset.tag = item.name;

        //     this.containerResult.appendChild(inputElement);

        //     const containerTag = this.containerTag;
        //     const dispatchEvent = this.dispatchEvent;

        //     const isSelectTag = function () {
        //         if (containerTag.childNodes.length == 0) return false;

        //         return true;
        //     };

        //     const getSelectedTag = function () {
        //         if (!isSelectTag()) return false;

        //         var arr = [];

        //         containerTag.childNodes.forEach(function (item) {
        //             arr.push(item.childNodes[0].textContent);
        //         });

        //         return arr;
        //     };

        //     const isDuplicateTag = function (tag) {
        //         var getTag = getSelectedTag();
        //         if (!getTag) return false;

        //         return getTag.some(function (item) {
        //             return tag === item;
        //         });
        //     };

        //     var addClick = function () {
        //         this.style.display = "none";
        //         var tagSelected = document.createElement("span");
        //         var tagValue = this.childNodes[0].textContent;
        //         tagSelected.innerHTML = tagValue + "<i class='removeTag'>x</i>";

        //         tagSelected.getElementsByClassName("removeTag")[0].addEventListener(
        //             "click",
        //             function () {
        //                 tagSelected.remove();
        //             },
        //             false
        //         );

        //         if (!isDuplicateTag(tagValue)) {
        //             containerTag.appendChild(tagSelected);

        //             console.log("dispatched danvir");
        //             var event = new CustomEvent("search-selected", { detail: { tag: "tagValue" } });
        //             dispatchEvent(event);
        //         }
        //     };

        //     inputElement.addEventListener("click", addClick, true);
        // });

        // result.map(function (item) {});
    }

    handleGoTo(hash: string) {
        console.log("handleGoTo");
        goPath("/stocks/MSFT", (hash = hash));
        var event = new CustomEvent("search-selected", { detail: { hash: hash } });
        this.dispatchEvent(event);

        this.clearSearch();
    }

    clearSearch() {
        this.results = [];
        console.log(this.search);
        this.search.value = "";
        this.search.focus();
    }

    render() {
        return html`
            <div class="container">
                <div
                    class="search-container"
                    @keyup=${(e) => {
                        const results = this.fuse.search(e.target.value);
                        this.results = results;
                    }}
                    @search=${(e) => {
                        const results = this.fuse.search(e.target.value);
                        this.results = results;
                    }}
                >
                    <input class="search" id="searchleft" type="search" name="q" placeholder="Search within ${this.companyName}" />
                    <label class="button searchbutton" for="searchleft"><span class="mglass">&#9906;</span></label>
                </div>
                <div style="position: relative;">
                    <div id="resultWrapper">
                        <div id="result" class="result">
                            ${this.results.map((result, index) => {
                                const item = result.item;
                                return html`
                                    <div class="resultBox" @click="${() => this.handleGoTo(item.hash)}">
                                        <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
                                            <vaadin-horizontal-layout style="align-items: center;" theme="spacing">
                                                <span class="resultName">${item.name}</span>
                                            </vaadin-horizontal-layout>
                                            <span class="resultDescription">${item.description}</span>
                                        </vaadin-vertical-layout>
                                    </div>
                                `;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

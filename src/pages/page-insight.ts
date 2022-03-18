import { html, css } from "lit";
import { customElement, query } from "lit/decorators.js";

import "../components/organisms/top-navbar/top-navbar";
import "../components/templates/bottom-navbar";
import "../components/templates/tabs/insight-calendar";
import "../components/templates/tabs/insight-trends";
import { HammerController } from "../controllers/hammer-controller";
import { PageElement } from "../helpers/page-element.js";

@customElement("page-insight")
export class PageInsight extends PageElement {
    /* Start of properties, state */

    // Reactive controller for hammer gestures
    private _ = new HammerController(this, { tap: {}, pan: {} }, { panleft: { selectors: ["#content"] }, panright: { selectors: [".lemon"] }, tap: { selectors: [".lemon"] }, options: {} });

    @query("#trends")
    private _trends: Element;

    @query("#news")
    private _news: Element;

    @query("#calendar")
    private _calendar: Element;

    @query("#direct")
    private _directnews: Element;

    /* End of properties etc. */

    static styles = css`
        section {
            padding: 0.2rem;
            height: 60%;
        }

        /* tabs activation */
        section article {
            /* float: left; */
            display: none;
        }
        section article.active {
            display: block;
            /* display: flex; */
        }
        /* End of tab activation */

        /* Slide Tabs Styling */
        section #calendar {
            position: relative;
            left: 400px;
            display: none;
            /* opacity: 0;
            visibility: hidden;
            transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s; */
        }
        #calendar[active] {
            visibility: visible;
            display: flex;
            opacity: 1;
        }
        /* End of slide tabs ... */
    `;

    private _slideLeftHandler(e: Event) {
        // Slides the section
        const el = this.shadowRoot?.querySelector("#content");
        const target = e.detail.event;
        const x = target.deltaX;

        // Pan to the Left

        // Display hidden delete action
        var nextTabEl = this.shadowRoot?.querySelector("#calendar");
        var att = document.createAttribute("active");
        nextTabEl.setAttributeNode(att);

        if (target.isFinal == true) {
            console.debug("isFinal", target.isFinal, x);
            (el as HTMLElement).style.transform = `translate3d(0px,0,0)`;
            //this.slideIsOpen = true;
            return;
        }

        (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
    }

    private _removeActive() {
        // Reset Tabs
        this._trends.classList.remove("active");
        this._calendar.classList.remove("active");
        this._news.classList.remove("active");
        this._directnews.classList.remove("active");
    }

    private _handleTabSelectedChanged(e) {
        // Handles Tab content switching
        this._removeActive();

        switch (e.detail.value) {
            case 0:
                this._trends.classList.add("active");
                break;
            case 1:
                this._calendar.classList.add("active");
                break;
            case 2:
                this._news.classList.add("active");
                break;
            case 3:
                this._directnews.classList.add("active");
                break;
            default:
                this._trends.classList.add("active");
        }
    }

    render() {
        return html`
            <top-navbar .location=${this.location}></top-navbar>
            <section>
                <vaadin-tab>Trends</vaadin-tab>
                <vaadin-tab>Calendar</vaadin-tab>
                <vaadin-tab>News</vaadin-tab>
                <vaadin-tab disabled>yld0</vaadin-tab>

                <vaadin-tabs @selected-changed=${this._handleTabSelectedChanged}>
                    <vaadin-tab>Trends</vaadin-tab>
                    <vaadin-tab>Calendar</vaadin-tab>
                    <vaadin-tab>News</vaadin-tab>
                    <vaadin-tab disabled>yld0</vaadin-tab>
                </vaadin-tabs>

                <section id="content" @panleft=${(e) => this._slideLeftHandler(e)}>
                    <table class="yld0" style="width:100%;">
                        <tr style="width:100%;">
                            <td style="width:100%;">
                                <article id="trends"><insight-trends></insight-trends></article>
                            </td>

                            <td style="width:100%;">
                                <article id="calendar"><insight-calendar></insight-calendar></article>
                            </td>
                            <td style="width:100%;">
                                <article id="news"><insight-calendar></insight-calendar></article>
                            </td>
                            <td style="width:100%;">
                                <article id="direct"><insight-calendar></insight-calendar></article>
                            </td>
                        </tr>

                        <tr></tr>
                    </table>
                </section>
            </section>

            <!-- The bottom tabs -->
            <bottom-navbar .location=${this.location}></bottom-navbar>
        `;
    }

    meta() {
        return {
            title: "Insight",
            description: "Trends & news",
        };
    }
}

/* 
Hammer Touch Gestures 

Inspiration from: https://github.com/DreamworldSolutions/hammer-events/blob/master/hammer-events.js

*/

import isEmpty from "lodash-es/isEmpty";
import forEach from "lodash-es/forEach";
import { ReactiveControllerHost } from "lit";

import "hammerjs";
import propagating from "./propagating.js";

export class HammerController {
    private host: ReactiveControllerHost;
    private hammerEvents = {};
    private hammerLocalEvents = {};
    private _hammerEventsHandlers = {};
    private _hammerShadowDomEventsHandlers = {};

    constructor(host: ReactiveControllerHost, hammerEvents, hammerLocalEvents) {
        this.host = host;
        this.hammerEvents = hammerEvents;
        this.hammerLocalEvents = hammerLocalEvents;
        host.addController(this);
    }

    /**
     * Re-bind hammer local shadow dom events.
     * @public
     */
    // hammerRefresh() {
    //     this._bindHammerEvents();
    // }

    /**
     * Unbind host hammer events.
     * @private
     */
    private _unbindHammerEvents() {
        if (isEmpty(this._hammerEventsHandlers) && isEmpty(this._hammerShadowDomEventsHandlers)) {
            return;
        }

        forEach(this._hammerEventsHandlers, (hammer, event) => {
            hammer = hammer || [];

            forEach(hammer, (value) => {
                let hammerInstance = value && value.hammer;
                let handler = value && value.handler;
                if (handler && hammerInstance && event) {
                    hammerInstance.off(event, handler);
                    //hammerInstance.destroy && hammerInstance.destroy();
                }
            });
        });

        this._hammerEventsHandlers = {};

        forEach(this._hammerShadowDomEventsHandlers, (hammer, event) => {
            hammer = hammer || [];

            forEach(hammer, (value) => {
                let hammerInstance = value && value.hammer;
                let handler = value && value.handler;
                if (handler && hammerInstance && event) {
                    hammerInstance.off(event, handler);
                    //hammerInstance.destroy && hammerInstance.destroy();
                }
            });
        });

        this._hammerShadowDomEventsHandlers = {};
    }

    /**
     * Bind host hammer events.
     * @private
     */
    private _bindHammerEvents() {
        this._unbindHammerEvents();

        if (isEmpty(this.hammerEvents) && isEmpty(this.hammerLocalEvents)) {
            return;
        }

        forEach(this.hammerEvents, (options, event) => {
            options = options || {};
            let hammer = propagating(new Hammer(this.host));
            hammer.get(event);
            let handler = (e) => {
                this.host.dispatchEvent(new CustomEvent(event, { detail: { event: e }, bubbles: false, composed: true }));
            };

            if (!this._hammerEventsHandlers[event]) {
                this._hammerEventsHandlers[event] = [];
            }

            console.debug("binding hammer event: ", event, " to handler");
            hammer.on(event, handler);
            this._hammerEventsHandlers[event].push({ hammer, handler });
        });

        forEach(this.hammerLocalEvents, (value, event) => {
            let aElements = value.selectors || [];
            let options = value.options || {};
            forEach(aElements, (selector) => {
                let aSelectorElement = this.host.shadowRoot.querySelectorAll(selector) || this.host.querySelectorAll(selector) || [];
                forEach(aSelectorElement, (element) => {
                    let hammer = propagating(new Hammer(element, options));
                    hammer.get(event);

                    let handler = (e) => {
                        element.dispatchEvent(new CustomEvent(event, { detail: { event: e }, bubbles: false, composed: true }));
                    };

                    if (!this._hammerShadowDomEventsHandlers[event]) {
                        this._hammerShadowDomEventsHandlers[event] = [];
                    }

                    console.debug("binding local hammer event: ", event, " to handler");
                    hammer.on(event, handler);
                    this._hammerShadowDomEventsHandlers[event].push({ hammer, handler });
                });
            });
        });

        console.debug("this._hammerEventsHandlers: ", this._hammerEventsHandlers);
        console.debug("this._hammerShadowDomEventsHandlers: ", this._hammerShadowDomEventsHandlers);
    }

    hostUpdated() {
        this._bindHammerEvents();
    }

    hostConnected() {
        this._bindHammerEvents();
    }

    hostDisconnected() {
        this._unbindHammerEvents();
    }
}

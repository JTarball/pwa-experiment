/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { RouterLocation } from "@vaadin/router";
import { LitElement } from "lit";
import type { PropertyValues } from "lit";
import { state, property } from "lit/decorators.js";

import config from "../config.js";
import { updateMeta } from "./html-meta-manager/index.js";
import type { MetaOptions } from "./html-meta-manager/index.js";

export class PageElement extends LitElement {
    @state()
    protected location?: RouterLocation;

    @property({ type: Boolean, reflect: true }) dark;

    private defaultTitleTemplate = `%s | ${config.appName}`;

    protected get defaultMeta() {
        return {
            url: window.location.href,
            titleTemplate: this.defaultTitleTemplate,
        };
    }

    /**
     * The page must override this method to customize the meta
     */
    protected meta(): MetaOptions | undefined {
        return;
    }

    /**
     * Gets back url if present
     */
    protected getBackUrl() {
        return this.location?.search?.get("backurl") || "";
    }

    updated(changedProperties: PropertyValues<this>) {
        super.updated(changedProperties);

        const meta = this.meta();

        if (meta) {
            updateMeta({
                ...this.defaultMeta,
                ...((meta.titleTemplate || meta.titleTemplate === null) && {
                    titleTemplate: meta.titleTemplate,
                }),
                ...meta,
            });
        }
    }
}

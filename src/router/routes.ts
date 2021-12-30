/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Route, ChildrenFn } from "@vaadin/router";

export type ViewRoute = Route & {
    title?: string;
    icon?: string;
    children?: Route[] | ChildrenFn;
};

export const routes: ViewRoute[] = [
    {
        path: "/",
        name: "home",
        title: "yld0",
        animate: false,
        component: "page-home",
        action: async () => {
            await import("../pages/page-home.js");
        },
    },
    {
        path: "/test",
        name: "test",
        title: "test",
        animate: false,
        component: "page-test",
        action: async () => {
            await import("../pages/page-test.js");
        },
    },
    {
        path: "/stocks",
        name: "stocks",
        title: "Stocks",
        animate: false,
        component: "page-stock-detail",
        action: async () => {
            await import("../pages/page-stock-detail.js");
        },
    },
    {
        path: "/alerts",
        name: "alerts",
        title: "Alerts",
        animate: true,
        // animate: {
        //     enter: "entering",
        //     leave: "leaving",
        // },
        component: "page-alerts",
        action: async () => {
            await import("../pages/page-alerts.js");
        },
    },
    {
        path: "/alerts/:symbol",
        name: "alerts-symbol",
        title: "Alerts",
        animate: {
            enter: "child-entering" /* Not technically used - but we dont want default  */,
            leave: "child-leaving",
        },
        component: "page-alerts-stock",
        action: async () => {
            await import("../pages/page-alerts-stock.js");
        },
    },
    {
        path: "/insight",
        name: "insight",
        title: "Insight",
        animate: false,
        component: "page-insight",
        action: async () => {
            await import("../pages/page-insight.js");
        },
    },
    {
        path: "/history",
        name: "history",
        title: "History",
        animate: true,
        component: "page-history",
        action: async () => {
            await import("../pages/page-history.js");
        },
    },
    {
        path: "/about",
        name: "about",
        title: "About",
        animate: true,
        component: "page-about",
        action: async () => {
            await import("../pages/page-about.js");
        },
    },
    {
        path: "(.*)",
        name: "not-found",
        title: "Not Found",
        animate: true,
        component: "page-not-found",
        action: async () => {
            await import("../pages/page-not-found.js");
        },
    },
];

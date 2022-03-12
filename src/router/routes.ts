/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Route, ChildrenFn } from "@vaadin/router";

import { myState } from "../store/state.js";

import { AuthorisationService } from "../auth/auth";

export type ViewRoute = Route & {
    title?: string;
    icon?: string;
    children?: Route[] | ChildrenFn;
};

// const authGuard = async (context: Context, commands: Commands) => {
//     console.warn("danvir", commands);
//     if (!myState.loggedIn) {
//         // Save requested path
//         //sessionStorage.setItem('login-redirect-path', context.pathname);
//         return commands.redirect("/login");
//     }
//     return undefined;
// };

// Useful: https://www.thisdot.co/blog/using-route-guards-actions-and-web-components

// export const routes: ViewRoute[] = [
//     {
//         path: "/",
//         component: "main-layout",
//         action: authGuard,
//     },

//     // {
//     //     path: "/",
//     //     name: "home",
//     //     title: "yld0",
//     //     animate: false,
//     //     component: "page-home",
//     //     action: async () => {
//     //         await import("../pages/page-home.js");
//     //     },
//     // },
//     {
//         path: "/login",
//         name: "login",
//         title: "yld0",
//         animate: false,
//         component: "page-login",
//         action: async () => {
//             await import("../pages/page-login.js");
//         },
//     },
//     {
//         path: "/test",
//         name: "test",
//         title: "test",
//         animate: false,
//         component: "page-test",
//         action: async () => {
//             await import("../pages/page-test.js");
//         },
//     },
//     {
//         path: "/stocks",
//         name: "stocks",
//         title: "Stocks",
//         animate: false,
//         component: "page-stock-detail",
//         action: async () => {
//             await import("../pages/page-stock-detail.js");
//         },
//     },
//     {
//         path: "/alerts",
//         name: "alerts",
//         title: "Alerts",
//         animate: true,
//         // animate: {
//         //     enter: "entering",
//         //     leave: "leaving",
//         // },
//         component: "page-alerts",
//         action: async () => {
//             await import("../pages/page-alerts.js");
//         },
//     },
//     {
//         path: "/alerts/:symbol",
//         name: "alerts-symbol",
//         title: "Alerts",
//         animate: {
//             enter: "child-entering" /* Not technically used - but we dont want default  */,
//             leave: "child-leaving",
//         },
//         component: "page-alerts-stock",
//         action: async () => {
//             await import("../pages/page-alerts-stock.js");
//         },
//     },
//     {
//         path: "/insight",
//         name: "insight",
//         title: "Insight",
//         animate: false,
//         component: "page-insight",
//         action: async () => {
//             await import("../pages/page-insight.js");
//         },
//     },
//     {
//         path: "/history",
//         name: "history",
//         title: "History",
//         animate: true,
//         component: "page-history",
//         action: async () => {
//             await import("../pages/page-history.js");
//         },
//     },
//     {
//         path: "/about",
//         name: "about",
//         title: "About",
//         animate: true,
//         component: "page-about",
//         action: async () => {
//             await import("../pages/page-about.js");
//         },
//     },
//     {
//         path: "(.*)",
//         name: "not-found",
//         title: "Not Found",
//         animate: true,
//         component: "page-not-found",
//         action: async () => {
//             await import("../pages/page-not-found.js");
//         },
//     },
// ];

export async function authGuard(context: Context, commands: Commands) {
    const isAuthenticated = await new AuthorisationService().isAuthorised();

    if (!isAuthenticated) {
        console.warn("User not authorized", context.pathname);
        return commands.redirect("/login");
    }

    return undefined;
}

export const views: ViewRoute[] = [
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
        path: "/stocks/:symbol",
        name: "stocks-detail",
        title: "Stock Quote",
        animate: {
            enter: "child-entering" /* Not technically used - but we dont want default  */,
            leave: "child-leaving",
        },
        component: "page-ticker-detail",
        action: async () => {
            await import("../pages/page-ticker-detail.js");
        },
    },
    {
        path: "/stocks",
        name: "stocks",
        title: "Stocks",
        animate: false,
        component: "page-stock-detail",
        action: async () => {
            await import("../pages/page-ticker-detail.js");
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
        path: "/explain",
        name: "explain",
        title: "Explain anything!",
        animate: true,
        component: "page-glossary",
        action: async () => {
            await import("../pages/page-glossary.js");
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

export const routes: ViewRoute[] = [
    {
        path: "/oauth-support",
        name: "oauth support",
        title: "yld0",
        animate: false,
        component: "page-oauth-support",
        action: async () => {
            await import("../pages/auth/page-oauth-support.js");
        },
    },
    {
        path: "/login",
        name: "login",
        title: "yld0",
        animate: false,
        component: "page-login",
        action: async () => {
            await import("../pages/auth/page-login.js");
        },
    },
    {
        path: "/forgot-password",
        name: "forgot password",
        title: "yld0",
        animate: false,
        component: "page-forgot-password",
        action: async () => {
            await import("../pages/auth/page-forgot-password.js");
        },
    },
    {
        path: "/reset-password",
        name: "reset password",
        title: "yld0",
        animate: false,
        component: "page-reset-password",
        action: async () => {
            await import("../pages/auth/page-reset-password.js");
        },
    },
    {
        path: "/register",
        name: "register",
        title: "yld0",
        animate: false,
        component: "page-register",
        action: async () => {
            await import("../pages/auth/page-register.js");
        },
    },
    {
        path: "/verify-user",
        name: "verify-user",
        title: "yld0",
        animate: false,
        component: "page-verify-user",
        action: async () => {
            await import("../pages/auth/page-verify-user.js");
        },
    },
    {
        path: "",
        component: "main-layout",
        action: authGuard,
        children: views,
    },
];

/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Router } from "@vaadin/router";
import type { Params } from "@vaadin/router";

import { routes } from "./routes.js";

export const router = new Router();

router.setRoutes([
    // Redirect to URL without trailing slash
    {
        path: "(.*)/",
        action: (context, commands) => {
            const newPath = context.pathname.slice(0, -1);
            return commands.redirect(newPath);
        },
    },
    ...routes,
]);

export const attachRouter = (outlet: HTMLElement) => {
    router.setOutlet(outlet);
};

export const urlForName = (name: string, params?: Params) => {
    return router.urlForName(name, params);
};

export const titleForName = (name: string) => {
    return routes.filter((route) => route.name == name)[0]?.title;
};

export const getLocation = () => {
    return router.location;
};

export const goPath = (url: string, searchParamsUrl: string, hash = undefined) => {
    Router.go({
        pathname: url,
        search: searchParamsUrl,
        hash: hash,
    });
};

export const getBackUrl = () => {
    console.log("getBackUrl");
    const urlSearchParams = new URLSearchParams(router.location?.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const backurl = params.backurl || "";
    console.log("backurl: ", backurl);
    return backurl;
};

export const getSymbolFromPath = () => {
    const symbol = router.location?.params["symbol"] || "";
    console.log("symbol,", symbol, router.location?.search, router);
    return symbol;
};

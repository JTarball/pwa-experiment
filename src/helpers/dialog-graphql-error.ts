import { html, render } from "lit";
import { guard } from "lit/directives/guard.js";

import { formatError as defaultFormatError, GraphQLError, SourceLocation } from "graphql";
import { ApolloControllerOptions } from "@apollo-elements/core/apollo-controller";
import "@vaadin/dialog";

/**
 * A narrower type than `any` that won’t swallow errors from assumptions about
 * code.
 *
 * For example `(x as any).anything()` is ok. That function then returns `any`
 * as well so the problem compounds into `(x as any).anything().else()` and the
 * problem just goes from there. `any` is a type black hole that swallows any
 * useful type information and shouldn’t be used unless you know what you’re
 * doing.
 *
 * With `mixed` you must *prove* the type is what you want to use.
 *
 * The `mixed` type is identical to the `mixed` type in Flow.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/9999
 * @see https://flowtype.org/docs/builtins.html#mixed
 */
export type mixed = Record<string, any> | string | number | boolean | undefined | null;

export interface GraphQLFormattedErrorExtended {
    message: string;
    locations: ReadonlyArray<SourceLocation> | void;
    path: ReadonlyArray<string | number> | void;
    extensions?: {
        [s: string]: any;
    };
}

export type GraphQLErrorExtended = GraphQLError & {
    extensions: {
        exception: {
            hint?: string;
            detail?: string;
            code: string;
        };
    };
};

/**
 * Extracts the requested fields from a pg error object, handling 'code' -> 'errcode' mapping.
 */
function pickPgError(err: mixed, inFields: string | Array<string>): { [s: string]: string | void } {
    const result: mixed = {};
    let fields;
    if (Array.isArray(inFields)) {
        fields = inFields;
    } else if (typeof inFields === "string") {
        fields = inFields.split(",");
    } else {
        throw new Error("Invalid argument to extendedErrors - expected array of strings");
    }

    if (err && typeof err === "object") {
        fields.forEach((field: string) => {
            // pg places 'errcode' on the 'code' property
            if (typeof field !== "string") {
                throw new Error("Invalid argument to extendedErrors - expected array of strings");
            }
            const errField = field === "errcode" ? "code" : field;
            result[field] = err[errField] != null ? String(err[errField]) : err[errField];
        });
    }
    return result;
}

/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification, plus it can
 * extract additional error codes from the postgres error, such as 'hint',
 * 'detail', 'errcode', 'where', etc. - see `extendedErrors` option.
 */
export function extendedFormatError(error: GraphQLError, fields: Array<string>): GraphQLFormattedErrorExtended {
    if (!error) {
        throw new Error("Received null or undefined error.");
    }
    const originalError = error.originalError as GraphQLErrorExtended;
    const exceptionDetails = originalError && fields ? pickPgError(originalError, fields) : undefined;
    return {
        // TODO:v5: remove this
        ...exceptionDetails,

        ...(exceptionDetails
            ? {
                  // Reference: https://facebook.github.io/graphql/draft/#sec-Errors
                  extensions: {
                      ...originalError.extensions,
                      exception: exceptionDetails,
                  },
              }
            : null),
        message: error.message,
        locations: error.locations,
        path: error.path,
    };
}

// Refactored from: https://github.com/graphile/postgraphile/blob/7dde41da9204bbd381c20e5783439118650fccd2/src/postgraphile/http/createPostGraphileHttpRequestHandler.ts#L234
// Formats an error using the default GraphQL `formatError` function, and
// custom formatting using some other options.
export const formatError = (options: ApolloControllerOptions<D, V>, error: GraphQLError) => {
    const {
        // getGqlSchema,
        // pgPool,
        // pgSettings,
        // pgDefaultRole,
        // queryCacheMaxSize = 50 * MEGABYTE,
        extendedErrors,
        showErrorStack,
        // watchPg,
        // disableQueryLog,
        // enableQueryBatching,
    } = options;

    // Get the appropriate formatted error object, including any extended error
    // fields if the user wants them.
    const formattedError = extendedErrors && extendedErrors.length ? extendedFormatError(error, extendedErrors) : error;

    // If the user wants to see the error’s stack, let’s add it to the
    // formatted error.
    if (showErrorStack) (formattedError as Record<string, any>)["stack"] = error.stack != null && showErrorStack === "json" ? error.stack.split("\n") : error.stack;

    return formattedError;
};

export const dialogGraphError = (error) => {
    // Show dialog Graphql Error

    return html`
        <vaadin-dialog
            aria-label="Help Info"
            opened
            .renderer="${guard([], () => (root: HTMLElement) => {
                render(
                    html`
                        <vaadin-vertical-layout theme="spacing" style="width: 300px; max-width: 100%; align-items: stretch;">
                            <h2 style="margin: 0; font-size: 1.5em; font-weight: bold;">Data Fetch Error</h2>
                            <span style="margin: 0; color: var(--lumo-secondary-text-color); font-size: var(--lumo-font-size-xxs); font-style: italic;">
                                This is awkward, something crashed! ... well, at least it wasn't the stock market
                            </span>
                            <p style="font-size: var(--lumo-font-size-xxs);" label="Description">${error}</p>
                            <!-- <p style="font-size: var(--lumo-font-size-xxs);" label="Description">${error.stack}</p> -->
                            <vaadin-button disabled @click="${() => (root.opened = false)}" style="align-self: flex-end;"> Report Issue </vaadin-button>
                            <vaadin-button @click="${() => (root.opened = false)}" style="align-self: flex-end;"> Close </vaadin-button>
                        </vaadin-vertical-layout>
                    `,
                    root
                );
            })}"
        ></vaadin-dialog>
    `;
};

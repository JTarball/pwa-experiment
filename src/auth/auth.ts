const AUTH_SERVICE_HOST = `http://localhost:8002`;

import jwt_decode from "jwt-decode";

import { myState } from "../store/state.js";
import { refreshClient } from "../store/client";

// Useful: https://jasonwatmore.com/post/2020/05/22/angular-9-jwt-authentication-with-refresh-tokens

export const googleAuthorise = async () => {
    console.log(`authoriseOauth,`);
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/google/authorize?authentication_backend=jwt&scopes=openid&scopes=profile&scopes=email`, {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        });

        if (response.ok) {
            return response;
        } else {
            console.error(`Authorise oauth failed: ${response.status}`);
            return response;
        }
    } catch (error) {
        console.warn("Unexpected error: Failed to authorise google oauth", error);
        return undefined;
    }
};

export const googleCallback = async (queryString: string) => {
    console.debug(`googleCallback, query: ${queryString}`);
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/google/callback${queryString}`, {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        });

        if (response?.ok) {
            const data = await response.json();
            console.log(data.access_token, data);
            myState.jwt_token = data.access_token;
            //window.__APOLLO_CLIENT__?.clearStore();
            await setInitialRefreshToken();
            return response;
        } else {
            console.error(`google callback failed: ${response.status}`);
            return response;
        }
    } catch (error) {
        console.warn("Unexpected error: Failed to google callback", error);
        return undefined;
    }
};

export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/register`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            // request verification endpoint
            await askToVerifyUser(email);
        }

        return response;
    } catch (error) {
        console.warn("Unexpected error: Failed to send to the forgot password endpoint, likely cannot connect to auth service ", error);
    }
};

export const askToVerifyUser = async (email: string) => {
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/request-verify-token`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                email: email,
            }),
        });

        return response;
    } catch (error) {
        console.warn("Unexpected error: Failed to send to the forgot password endpoint, likely cannot connect to auth service ", error);
    }
};

export const verifyUser = async (token: string) => {
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/verify`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
            }),
        });

        return response;
    } catch (error) {
        console.warn("Unexpected error: Failed to send to the auth verify endpoint, likely cannot connect to auth service ", error);
    }
};

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/jwt/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `username=${username}&password=${password}`,
        });

        if (response.ok) {
            const data = await response.json();
            myState.jwt_token = data.access_token;
            await setInitialRefreshToken();

            // We need to reset the graphql to include the new access token
            console.log("graphql client", window.__APOLLO_CLIENT__);
            // client.resetStore();
        }

        return response;
    } catch (error) {
        console.warn("Unexpected error: Failed to login, likely cannot connect to auth service ", error);
    }
};

export const logoutUser = async () => {
    await clearRefreshTokens();
};

export const forgotPassword = async (email: string) => {
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/forgot-password`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                email: email,
            }),
        });

        return response;
    } catch (error) {
        console.warn("Unexpected error: Failed to send to the forgot password endpoint, likely cannot connect to auth service ", error);
    }
};

export const userExists = async (email: string) => {
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/check-user-exists?email=${email}`, {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.exists;
        } else {
            console.error(`Check user exists failed: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.warn("Unexpected error: Failed to check user exists", error);
    }
};

export const userVerified = async (email: string) => {
    console.log(`userVerified, for email: ${email}`);
    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/check-user-verified?email=${email}`, {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.verified;
        } else {
            console.error(`Check user verified failed: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.warn("Unexpected error: Failed to check user is verified", error);
    }
};

export const resetPassword = async (password: string) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const params = Object.fromEntries(urlParams.entries());
    const token = params.token || "";

    try {
        const response = await fetch(`${AUTH_SERVICE_HOST}/auth/reset-password`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                password: password,
                token: token,
            }),
        });

        console.log("response, ", response);
        const data = await response.json();
        console.log("data, ", data);

        return response;
    } catch (error) {
        console.warn("Unexpected error: Failed to sent reset password, likely cannot connect to auth service ", error);
    }
};

const clearRefreshTokens = async () => {
    // Called as part of logout, clears the tokens associated with login

    console.log(myState.jwt_token);

    // refresh token clear
    const response = await fetch(`${AUTH_SERVICE_HOST}/auth/clear-refresh-token`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${myState.jwt_token}`,
        },
        credentials: "include",
    });

    if (!response.ok) {
        const message = `Failed to clear the refresh token: ${response.status}`;
        console.error(message);
    }

    // access token clear, remember no way to remove jwt on the server side
    myState.jwt_token = "";
};

export const setInitialRefreshToken = async () => {
    const response = await fetch(`${AUTH_SERVICE_HOST}/auth/set-refresh-token`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${myState.jwt_token}`,
        },
        credentials: "include",
    });

    if (!response.ok) {
        const message = `Failed to set the refresh token: ${response.status}`;
        console.error(message);
    }
};

export class AuthorisationService {
    private refreshTokenTimeout;

    private isTokenExpired = () => {
        if (myState.jwt_token) {
            var decoded = jwt_decode(myState.jwt_token);
            return Date.now() >= decoded.exp * 1000;
        } else {
            console.warn("isTokenExpired, no token to check expired. Setting expired to true.");
            return true;
        }
    };

    public refreshToken = async () => {
        console.debug("AuthorisationService::refreshToken,");
        try {
            const response = await fetch(`${AUTH_SERVICE_HOST}/auth/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: ``,
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                myState.jwt_token = data.access_token;
                //console.log("refreshToken", window.__APOLLO_CLIENT__, data.access_token);
                //await refreshClient();
                this.startRefreshTimer();
            } else {
                const data = await response.json();
                console.debug(`Failed to refresh token: ${response.status} ${data}`);
            }
        } catch (error) {
            console.warn("Unexpected error: Failed to login, likely cannot connect to auth service ", error);
        }
    };

    public async startRefreshTimer() {
        console.debug("AuthorisationService::startRefreshTimer, setting refresh token timer.");
        // set a timeout to refresh the token a minute before it expires
        var decoded = jwt_decode(myState.jwt_token);
        const expires = new Date(decoded.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 60 * 1000;
        console.debug(`AuthorisationService::startRefreshTimer, timeout for refresh is set to ${timeout}.`);
        this.refreshTokenTimeout = await setTimeout(() => this.refreshToken(), timeout);
    }

    public clearRefreshTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    public async isAuthorised(): Promise<boolean> {
        // Is the access token available
        // Gather the refresh token if it exists,
        // Attempt to refresh the token

        // refresh_token is a http_only cookie,
        // so we have to call refresh_token to check if
        // it is possible

        if (myState.jwt_token) {
            console.debug("AuthorisationService::isAuthorised, have token already, checking expiration.");
            const expired = this.isTokenExpired();
            return !expired;
        } else {
            console.debug("AuthorisationService::isAuthorised, no access token, attempting to use refresh token.");
            await this.refreshToken();
            return myState.jwt_token ? true : false;
        }
    }
}

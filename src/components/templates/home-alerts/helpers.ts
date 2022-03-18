export const showHowManyAlertsConfigured = (alerts: [Object]) => {
    let output;
    switch (alerts.length) {
        case 0:
            output = `${alerts.length} alerts configured`;
            break;
        case 1:
            output = `${alerts.length} alert configured`;
            break;
        default:
            output = `${alerts.length} alerts configured`;
    }

    return output;
};

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset).
 * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function}  A new, throttled, function.
 */

//
export const showHowManyAlerts = (alerts: [Object]) => {
    let output;
    switch (alerts.length) {
        case 0:
            output = `${alerts.length} alerts`;
            break;
        case 1:
            output = `${alerts.length} alert`;
            break;
        default:
            output = `${alerts.length} alerts`;
    }

    return output;
};

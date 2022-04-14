import { html } from "lit";

export const truncate = (str: string, length: int = 20) => {
    if (str == null) {
        return "";
    }
    return str.length > length ? str.substring(0, length - 3) + "..." : str;
};

export const pnMetric = (condVal: number, val: str) => {
    const pos = condVal > 0 ? true : false;

    return html`<span class="${pos ? "positiveMetric" : "negativeMetric"}">${val}</span>`;
};

export const pnMetricBool = (cond: boolean, val: str) => {
    return html`<span class="${cond ? "positiveMetric" : "negativeMetric"}">${val}</span>`;
};

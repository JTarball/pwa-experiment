import { html } from "lit";

export const truncate = (str: string, length: int = 20) => {
    if (str == null) {
        return "";
    }
    return str.length > length ? str.substring(0, length - 3) + "..." : str;
};

export const pnMetricSimple = (condVal: number) => {
    const pos = condVal > 0 ? true : false;

    return html`<span class="${pos ? "positiveMetric" : "negativeMetric"}">${condVal}</span>`;
};

export const pnMetric = (condVal: number, val: str) => {
    const pos = condVal > 0 ? true : false;

    return html`<span class="${pos ? "positiveMetric" : "negativeMetric"}">${val}</span>`;
};

export const pnMetricBool = (cond: boolean, val: str) => {
    return html`<span class="${cond ? "positiveMetric" : "negativeMetric"}">${val}</span>`;
};

export const posMetric = (val: str) => {
    return html`<span class="positiveMetric">${val}</span>`;
};

export const negMetric = (val: str) => {
    return html`<span class="negativeMetric">${val}</span>`;
};

export const posBgMetric = (val: str) => {
    return html`<span class="positiveBgMetric">${val}</span>`;
};

export const negBgMetric = (val: str) => {
    return html`<span class="negativeBgMetric">${val}</span>`;
};

import { html } from "lit";

export function renderLoading() {
    // Inspired by https://nzbin.github.io/three-dots/

    // const toggleLoader = () => {};

    // const timeout = setTimeout(toggleLoader, 50);

    // setTimeout(function () {
    //     console.log("danvir, loading");
    // }, 10); // we dont want to display loading if under a second, looks naff

    //     return html`
    //         <div class="dot-stage">
    //             <div class="dot dot-0"></div>
    //             <div class="dot dot-1"></div>
    //             <div class="dot dot-2"></div>
    //         </div>
    //     `;

    return html`
        <div class="dot-stage">
            <div class="dot dot-0"></div>
            <div class="dot dot-1"></div>
            <div class="dot dot-2"></div>
        </div>
    `;
}

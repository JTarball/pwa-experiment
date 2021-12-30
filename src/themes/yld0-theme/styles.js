import { css } from "lit";


import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";


export const themeStyles = css`

            /* Default section */
            section {
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-xxs);
            }

            /* Theme styling for tables */
            table {
                border-collapse: collapse;
                width: 100%;
                margin-top: 20px;
                margin-bottom: 60px;
            }

            table tr,
            table td {
                transition: transform 0.35s ease-out;
                border-color: var(--lumo-contrast-10pct);
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding-top: 8px;
                padding-bottom: 8px;
                text-align: center;
                vertical-align: middle;
            }

            /* table thead tr {
                border-bottom-width: 0px;
            } */

            table th {
                padding: 10px;
                text-align: left;
            }

            .rubberband {
                -webkit-animation-name: rubberBand;
                animation-name: rubberBand;
            }

            .tdDeleteRow {
                position: absolute;
                right: -100px;
                display: none;
                opacity: 0;
                visibility: hidden;
                transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
            }
            .tdDeleteRow[active] {
                visibility: visible;
                display: flex;
                opacity: 1;
            }

            button:hover {
                animation-name: rubberBand;
            }

            @media screen and (max-width: 355px) {
                table {
                    width: 100%;
                    margin-top: 50px;
                }

                table thead {
                    display: none;
                }

                table tr,
                table td {
                    border-bottom: 1px solid #ddd;
                }

                table tr {
                    margin-top: 8px;
                    margin-bottom: 8px;
                }

                table td {
                    display: flex;
                }

                table td::before {
                    content: attr(label);
                    font-weight: bold;
                }
            }

            /* yld0 Table styling */
            table th span.headerTitle {
                font-size: 1em;
                color: var(--lumo-primary-text-color);
            }

            table th span {
                font-size: 0.7em;
                color: var(--lumo-secondary-text-color);
            }

            table td span {
                color: var(--lumo-secondary-text-color);
            }

            table td span.success {
                color: var(--lumo-success-color);
            }

            table td span.error {
                color: var(--lumo-error-color);
            }

            table td span.stockSymbol, table td span.title {
                padding-right: 8px;
                color: var(--lumo-primary-text-color);
                font-weight: 500;
            }

            table td span.title {
                font-size: var(--lumo-font-size-tiny);
            }

            table td span.companyName {
                font-size: var(--lumo-font-size-tiny);
                color: var(--lumo-secondary-text-color);
            }

           table td span.description{
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
            }

            table td span.priceChange {
                font-size: var(--lumo-font-size-tiny);
                animation: 1s 0.03s elasticExpand cubic-bezier(0.215, 0.61, 0.355, 1) both;
            }

            table td span.ellipsis {
                color: var(--lumo-secondary-text-color);
            }

            @keyframes elasticExpand {
                0% {
                    -moz-transform: scale(0.7);
                    -ms-transform: scale(0.7);
                    -o-transform: scale(0.7);
                    -webkit-transform: scale(0.7);
                    transform: scale(0.7);
                }
                50% {
                    -moz-transform: scale(1.05);
                    -ms-transform: scale(1.05);
                    -o-transform: scale(1.05);
                    -webkit-transform: scale(1.05);
                    transform: scale(1.05);
                }
                90% {
                    -moz-transform: scale(1.01);
                    -ms-transform: scale(1.01);
                    -o-transform: scale(1.01);
                    -webkit-transform: scale(1.01);
                    transform: scale(1.01);
                }
                100% {
                    -moz-transform: scale(1);
                    -ms-transform: scale(1);
                    -o-transform: scale(1);
                    -webkit-transform: scale(1);
                    transform: scale(1);
                }
            }

            span.description{
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
            }

            p.description{
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
            }



            /* End of table styling */

            /* Select & Menu Bar Options */
     
            /* End of Select & Menu Bar Options */

            /* Page animations */




           /* End of page animations  */

           /* Default button styling  */
           .buttonAdd {
                background-color: var(--divider-color);
                color: var(--secondary-text-color);
                font-size: var(--lumo-font-size-tiny);
            }

[theme~="dark"] {
    html{
        --lumo-base-color:hsla(214, 35%, 1%, 1)
        --lumo-primary-text-color: rgb(230, 175, 46);
        --lumo-primary-color-50pct: rgba(230, 175, 46, 0.5);
        --lumo-primary-color-10pct: rgba(230, 175, 46, 0.1);
        --lumo-primary-color: #E6AF2E;
        --lumo-success-text-color: rgb(164, 175, 105);
        --lumo-success-color-50pct: rgba(164, 175, 105, 0.5);
        --lumo-success-color-10pct: rgba(164, 175, 105, 0.1);
        --lumo-success-color: #A4AF69;
        --lumo-error-text-color: rgba(255, 250, 252, 0.99);
        --lumo-error-color-50pct: rgba(162, 37, 34, 0.5);
        --lumo-error-color-10pct: rgba(162, 37, 34, 0.1);
        --lumo-error-color: #A22522;
    }
}
`;



export const sharedStyles = [
    badge,
    utility,
    spacing,
    themeStyles,
];
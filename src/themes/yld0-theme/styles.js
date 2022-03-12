import { css } from "lit";


import { utility } from "@vaadin/vaadin-lumo-styles/utility";
import { spacing } from "@vaadin/vaadin-lumo-styles/utilities/spacing.js";
import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";


export const themeStyles = css`

            /* Vaadin Components */
            vaadin-button {
                cursor: pointer;
            
            }

            /* Default section */
            section {
                background: var(--lumo-base-color);
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-xxs);
                padding: 0.8rem;
                padding-bottom: 1rem;
        
            }


            @media only screen and (min-width: 992px) {
                section {
                    max-width: 768px;
                    margin-left: auto;
                    margin-right: auto;
                    padding: 2rem;
                }
            }


            /* Theme styling for tables */
            table {
                display: block;
                border-collapse: collapse;
                /* Do not change as it will conflict with Lightweight charts */
                /* width: 100%;
                margin-top: 20px;
                margin-bottom: 60px;
                padding-bottom: 100px; */
            }


            table.yld0 {
                display: block;
                border-collapse: collapse;
                width: 100%;
                margin-top: 20px;
                margin-bottom: 60px;
                padding-bottom: 100px; 
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

            table tr.disabled{
                pointer-events: none;
                color: #f3eaea;
                opacity: 0.2;
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

            table td span.stockSymbol, table td span.title, span.title {
                padding-right: 8px;
                color: var(--lumo-primary-text-color);
                font-weight: 500;
            }

            table td span.stockSymbolBig, span.stockSymbolBig {
                font-size: var(--lumo-font-size-xxl);
                font-weight: 500;
                color: var(--lumo-contrast);
                padding: 0;
                text-align: left;
            }


            table td span.title {
                font-size: var(--lumo-font-size-tiny);
            }

            table td span.companyName, span.companyName {
                font-size: var(--lumo-font-size-tiny);
                color: var(--lumo-secondary-text-color);
                padding: 0;
                text-align: left;
            }

           table td span.description, span.description {
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
            }

            span.priceBold {
                font-size: var(--lumo-font-size-micro);
                font-weight: 500;
                color: var(--lumo-contrast);
            }

            table td span.price {
                margin-left: auto;
                margin-right: auto;
            }

            table td span.priceChange {
                font-size: var(--lumo-font-size-tiny);
                animation: 1s 0.03s elasticExpand cubic-bezier(0.215, 0.61, 0.355, 1) both;
                margin-left: auto;
                margin-right: auto;
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



            p.description{
                font-size: var(--lumo-font-size-micro);
                color: var(--lumo-secondary-text-color);
            }


            /* Loading animation */

            .dot-stage {
                display:flex;
                justify-content:center;
                align-items:center;
                height:100%;
                min-height: 500px;
                z-index: 0;
            }

            .dot {
           
                width: 15px;
                height: 15px;
                border-radius: 7.5px;
                background-color: var(--lumo-primary-color-50pct);
                color: var(--lumo-primary-color-50pct);
                /* position: relative; */
                animation: dotFlashing 2.5s ease-in-out infinite;
                display: inline-block;
                margin: 0.2em;
            
            }

            .dot-0 {
                animation-delay:0s;
            }
            .dot-1{
                animation-delay:0.2s;
            }
            .dot-2{
                animation-delay:0.4s;
            }




            @keyframes dotFlashing {

                0%, 100%{
                    transform: scale(0.95);
                    opacity: 0.2;
                    background-color: var(--lumo-primary-color-50pct);
                }
                40%{
                    transform: scale(1);
                    opacity: 0.5;
                    background-color: var(--lumo-primary-color-50pct);
                }
                50%{
                    transform: scale(1);
                    opacity: 1;
                    background-color: var(--lumo-primary-color-50pct);
                }

            }


            .dot-flashing {
                margin: 50px;
                width: 10px;
                height: 10px;
                border-radius: 5px;
                background-color: var(--lumo-primary-color-50pct);
                color: var(--lumo-primary-color-50pct);
                position: relative;
                /* -webkit-animation: dotFlashing 1.6s infinite alternate;
                -webkit-animation-delay: 0.75s;

                animation: dotFlashing 1.6s infinite linear alternate;
                animation-delay: 0.75s; */
            }

            .dot-flashing::before,
            .dot-flashing::after {
                content: "";
                display: inline-block;
                position: absolute;
                top: 0;
            }

            .dot-flashing::before {
                left: -15px;
                width: 10px;
                height: 10px;
                border-radius: 5px;
                background-color: var(--lumo-primary-color-50pct);
                color: var(--lumo-primary-color-50pct);
                -webkit-animation: dotFlashing 1.5s infinite alternate;
                -webkit-animation-delay: 0s;
              
                animation: dotFlashing 1.5s infinite alternate;
                animation-delay: 0s;
            }

            .dot-flashing::after {
                left: 15px;
                width: 10px;
                height: 10px;
                border-radius: 5px;
                background-color: var(--lumo-primary-color-50pct);
                color: var(--lumo-primary-color-50pct);
                -webkit-animation: dotFlashing 1.5s infinite alternate;
                -webkit-animation-delay: 1.5s;

                animation: dotFlashing 1.5s infinite alternate;
                animation-delay: 1.5s;
            }

            /* */

            /* End of table styling */

            /* Select & Menu Bar Options */
     
            /* End of Select & Menu Bar Options */

            /* Page animations */

            /* Price Change */

            .priceUp {
                color: var(--lumo-success-color);
            }

            .priceDown {
                color:  var(--lumo-error-color);
            }

            /* Icon for stock price changes */
            .trendingUp {
                border-radius: 50%;
                transform: rotate(-135deg);
                background-color: #ecf9f2;
                color: var(--lumo-success-color);
            }

            .trendingDown {
                border-radius: 50%;
                transform: rotate(45deg);
                background-color: #ffe6e8;
                color: var(--lumo-error-color);
            }

            /* End of icon for stock price changes */

            /* End of Price Change */



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
        --lumo-primary-color-50pct: rgba(230, 175, 46, 0.1);
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
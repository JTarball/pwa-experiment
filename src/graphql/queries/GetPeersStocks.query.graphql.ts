import { gql } from "@apollo/client/core";

export const GetPeersStocks = gql`
    query GetPeersStocks($symbols: [String]) {
        stocks(symbols: $symbols) {
            items {
                symbol
                company_name
                logo_url
                description
                country
                market_cap
                market_cap_numerize

                price

                dcf_price
                dcf_price_number
                dcf_diff_percentage
                dcf_diff_percentage_number
            }
            total_results
        }
    }
`;

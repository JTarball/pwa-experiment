// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetSingleStock = gql`
    query GetSingleStock($symbol: String!) {
        single_stock(symbol: $symbol) {
            symbol
            company_name
            logo_url
            exchange
            price
            price_number
            currency_symbol
            price_change
            price_change_percent
            price_change_1yr
            price_change_1yr_percent
            price_change_since_watched
            price_change_since_watched_percent
            historical_prices_1yr {
                date
                close
            }
            dcf_price
            notes {
                uuid
                created_at
                title
                notes
                price
                price_number
                checklist {
                    uuid
                    name
                }
            }
            following
        }
    }
`;

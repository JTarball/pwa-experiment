// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetFollows = gql`
    query GetFollows {
        follows {
            items {
                symbol
                company_name
                logo_url
                price
                price_number
                currency_symbol
                price_change
                price_change_percent
                price_change_1yr
                price_change_1yr_percent
                price_change_since_watched
                price_change_since_watched_percent
                target_low_price
                target_high_price
                target_mean_price
                target_median_price
                dcf
            }
            total_results
        }
    }
`;

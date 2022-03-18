// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetFollows = gql`
    query GetFollows {
        follows(only_with_alerts: false) {
            items {
                symbol
                company_name
                logo_url
                currency_symbol

                price
                price_number
                price_change
                price_change_percent

                alerts {
                    uuid
                    alert_type
                    title
                }
            }
            total_results
        }
    }
`;

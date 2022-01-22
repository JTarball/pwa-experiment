// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetFollows = gql`
    query GetFollows {
        follows(only_with_alerts: true) {
            items {
                symbol
                company_name
                logo_url
                alerts {
                    uuid
                    title
                    help
                    info
                    notification_types
                    enabled
                    triggered
                }
            }
            total_results
        }
    }
`;

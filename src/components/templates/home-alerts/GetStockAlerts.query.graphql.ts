// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetStockAlerts = gql`
    query GetStockAlerts($symbol: String!) {
        alerts(symbol: $symbol) {
            items {
                uuid
                alert_type
                title
                repeated
                notes
                description
                info
                created_at
                notification_types
                enabled
                triggered
                graph_annotations {
                    name
                    value
                }
            }
            total_results
        }
    }
`;

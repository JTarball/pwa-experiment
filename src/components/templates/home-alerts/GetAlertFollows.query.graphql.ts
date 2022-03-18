// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetAlertFollows = gql`
    query GetAlertFollows {
        follows(only_with_alerts: true) {
            items {
                symbol
                company_name
                logo_url
                alerts {
                    uuid
                    alert_type
                    title
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
            }
            total_results
        }
    }
`;

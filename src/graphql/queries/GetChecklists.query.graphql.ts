// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetChecklists = gql`
    query GetChecklists {
        checklists {
            items {
                uuid
                name
                description
                created_at
                checklist {
                    type
                    title
                    info
                    choices {
                        id
                        label
                        selected
                        background_color
                    }
                }
            }
            total_results
        }
    }
`;

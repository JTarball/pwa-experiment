// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const DeleteAlert = gql`
    mutation DeleteAlert($uuid: String) {
        delete_alert(uuid: $uuid) {
            trace_id
        }
    }
`;

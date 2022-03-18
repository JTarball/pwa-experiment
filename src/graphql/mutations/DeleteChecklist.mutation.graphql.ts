// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const DeleteChecklist = gql`
    mutation DeleteChecklist($uuid: String) {
        delete_checklist(uuid: $uuid) {
            trace_id
        }
    }
`;

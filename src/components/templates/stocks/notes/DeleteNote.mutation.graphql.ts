// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const DeleteNote = gql`
    mutation DeleteNote($symbol: String, $uuid: String) {
        delete_note(symbol: $symbol, uuid: $uuid) {
            trace_id
        }
    }
`;

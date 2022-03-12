import { gql } from "@apollo/client/core";

export const UpdateNote = gql`
    mutation UpdateNote($symbol: String, $uuid: String, $note: NoteUpdateInput) {
        update_note(symbol: $symbol, uuid: $uuid, note: $note) {
            trace_id
        }
    }
`;

import { gql } from "@apollo/client/core";

export const AddNote = gql`
    mutation AddNote($symbol: String, $note: NoteInput) {
        add_note(symbol: $symbol, note: $note) {
            trace_id
        }
    }
`;

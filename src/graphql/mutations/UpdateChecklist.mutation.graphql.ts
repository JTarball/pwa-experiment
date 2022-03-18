import { gql } from "@apollo/client/core";

export const UpdateChecklist = gql`
    mutation UpdateChecklist($uuid: String, $name: String, $description: String, $checklist: [ChecklistItem]) {
        update_checklist(uuid: $uuid, name: $name, description: $description, checklist: $checklist) {
            trace_id
        }
    }
`;

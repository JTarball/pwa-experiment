import { gql } from "@apollo/client/core";

export const AddChecklist = gql`
    mutation AddChecklist($name: String, $description: String, $checklist: [ChecklistItem]) {
        add_checklist(name: $name, description: $description, checklist: $checklist) {
            trace_id
        }
    }
`;

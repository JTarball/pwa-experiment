// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const UpdateAlert = gql`
    mutation UpdateAlert($uuid: String, $repeated: Boolean, $notification_types: [String], $notes: String, $enabled: Boolean) {
        update_alert(uuid: $uuid, repeated: $repeated, notification_types: $notification_types, notes: $notes, enabled: $enabled) {
            trace_id
        }
    }
`;

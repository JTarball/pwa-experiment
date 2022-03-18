import { gql } from "@apollo/client/core";

export const AddChangeInPercentAlert = gql`
    mutation AddChangeInPercentAlert($symbol: String, $repeated: Boolean, $description: String, $notes: String, $notification_types: [String], $alert_info: PercentFromCurrentAlertInfo) {
        add_change_in_percent_alert(symbol: $symbol, repeated: $repeated, description: $description, notes: $notes, notification_types: $notification_types, alert_info: $alert_info) {
            trace_id
        }
    }
`;

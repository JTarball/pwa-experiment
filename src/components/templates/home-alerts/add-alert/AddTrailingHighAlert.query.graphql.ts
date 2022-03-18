import { gql } from "@apollo/client/core";

export const AddTrailingHighAlert = gql`
    mutation AddTrailingHighAlert($symbol: String, $repeated: Boolean, $description: String, $notes: String, $notification_types: [String], $alert_info: TrailingPriceBuyStopAlertInfo) {
        add_trailing_high_alert(symbol: $symbol, repeated: $repeated, description: $description, notes: $notes, notification_types: $notification_types, alert_info: $alert_info) {
            trace_id
        }
    }
`;

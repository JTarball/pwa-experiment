import { gql } from "@apollo/client/core";

export const AddTrailingStopAlert = gql`
    mutation AddTrailingStopAlert($symbol: String, $repeated: Boolean, $description: String, $notes: String, $notification_types: [String], $alert_info: TrailingPriceStopLossAlertInfo) {
        add_trailing_stop_alert(symbol: $symbol, repeated: $repeated, description: $description, notes: $notes, notification_types: $notification_types, alert_info: $alert_info) {
            trace_id
        }
    }
`;

import { gql } from "@apollo/client/core";

export const AddChangeInPriceAlert = gql`
    mutation AddChangeInPriceAlert($symbol: String, $repeated: Boolean, $description: String, $notes: String, $notification_types: [String], $alert_info: PriceFromCurrentAlertInfo) {
        add_change_in_price_alert(symbol: $symbol, repeated: $repeated, description: $description, notes: $notes, notification_types: $notification_types, alert_info: $alert_info) {
            trace_id
        }
    }
`;

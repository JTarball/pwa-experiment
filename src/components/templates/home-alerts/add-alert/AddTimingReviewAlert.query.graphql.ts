import { gql } from "@apollo/client/core";

export const AddTimingReviewAlert = gql`
    mutation AddTimingReviewAlert($symbol: String, $repeated: Boolean, $description: String, $notes: String, $notification_types: [String], $alert_info: ReviewAlertInfo) {
        add_timing_review_alert(symbol: $symbol, repeated: $repeated, description: $description, notes: $notes, notification_types: $notification_types, alert_info: $alert_info) {
            trace_id
        }
    }
`;

import { gql } from "@apollo/client/core";

export const GetDividendHistory = gql`
    query GetDividendHistory($symbol: String!) {
        graph_dividend_history(symbol: $symbol) {
            payout_ratio {
                label
                ttm {
                    time
                    value
                }
                annual {
                    time
                    value
                }
                quarter {
                    time
                    value
                }
            }

            dividend_per_share {
                label
                ttm {
                    time
                    value
                }
                annual {
                    time
                    value
                }
                quarter {
                    time
                    value
                }
            }

            dividend_yield {
                label
                ttm {
                    time
                    value
                }
                annual {
                    time
                    value
                }
                quarter {
                    time
                    value
                }
            }
        }
    }
`;

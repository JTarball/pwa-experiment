import { gql } from "@apollo/client/core";

export const GetRecentStocks = gql`
    query GetRecentStocks($symbols: [String!]) {
        stocks(symbols: $symbols) {
            items {
                symbol
                company_name
                logo_url
                following
            }
            total_results
        }
    }
`;

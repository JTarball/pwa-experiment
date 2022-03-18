import { gql } from "@apollo/client/core";

export const GetStocks = gql`
    query GetStocks($name: String!) {
        stocks(name: $name) {
            items {
                symbol
                company_name
                logo_url
            }
            total_results
        }
    }
`;

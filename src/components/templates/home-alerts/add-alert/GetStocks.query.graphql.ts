import { gql } from "@apollo/client/core";

export const GetStocks = gql`
    query GetStocks($name: String!) {
        stocks(name: $name, limit: 25) {
            items {
                symbol
                company_name
                logo_url

                price
                price_number
            }
            total_results
        }
    }
`;

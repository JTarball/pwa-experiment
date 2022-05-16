// {'authorization': 'Bearer <ACCESS_TOKEN>'}

import { gql } from "@apollo/client/core";

export const GetSingleStock = gql`
    query GetSingleStock($symbol: String!) {
        single_stock(symbol: $symbol) {
            symbol
            company_name
            country
            sector
            industry
            website
            description
            logo_url
            exchange
            exchange_short_name
            exchange_timezone
            exchange_timezone_short_name

            price
            price_number

            market_cap_numerize
            dividend_yield_ttm_percentage
            ipo_date
            earnings_announcement
            shares_outstanding_numerize
            cik

            address
            city
            state
            phone
            investor_relations

            ceo
            full_time_employees

            quote_type
            is_actively_traded
            is_fund
            is_etf
            is_adr
            isin
            cusip

            press_releases {
                date
                title
                text
                url
            }

            sec_filings {
                filling_date
                type
                text
                cik
                link
            }

            news {
                date
                headline
                summary
                url
                image
                source
            }

            inside_trades {
                date
                filing_date
                cik
                company_cik
                transaction_type
                acquisition_or_deposition
                insider_name
                position
                shares_transacted
                shares_transacted_numerize
                shares_after
                trade_percent
                total_value
                total_value_numerize
                price
                price_numerize
                security_name
                link
            }

            currency
            currency_symbol
            price_change
            price_change_percent
            price_change_1yr
            price_change_1yr_percent
            price_change_since_watched
            price_change_since_watched_percent
            historical_prices_1yr {
                date
                close
            }
            # historical_dividends {
            #     date
            #     label
            #     adj_dividend
            #     dividend
            #     record_date
            #     payment_date
            #     declaration_date
            # }

            dcf_price
            notes {
                uuid
                created_at
                title
                notes
                price
                price_number
                checklist {
                    uuid
                    name
                }
            }
            following
        }
    }
`;

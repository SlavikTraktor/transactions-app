import { getCurrenciesRate } from '@/api/getCurrenciesRate'
import { getCurrenciesRatesRange } from '@/api/getCurrenciesRatesRange'
import type { TransactionExpanded } from '@/stores/transactions'
import { format } from 'date-fns'
import _ from 'lodash'

export const convertTransactionToGELCurrency = async (transactions: TransactionExpanded[]) => {
  const transactionsByCurrency = _.groupBy(transactions, 'currency')

  const resTransactions: TransactionExpanded[] = []

  for (const currency in transactionsByCurrency) {
    const sortedTransactions = _.sortBy(transactionsByCurrency[currency]!, 'timestamp')

    const beginDate = sortedTransactions[0]?.timestamp
    const endDate = sortedTransactions[sortedTransactions.length - 1]?.timestamp

    const currenciesRates =
      currency === 'GEL' ? [] : await getCurrenciesRatesRange(beginDate!, endDate!, [currency])

    for (const transaction of sortedTransactions) {
      if (currency === 'GEL') {
        transaction.conversion = {
          fromCurrency: currency,
          toCurrency: currency,
          rate: 1,
          resultAmount: transaction.amount,
        }
      } else {
        const formattedTimestamp = format(
          new Date(transaction.timestamp),
          "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
        )

        let rateForDate = currenciesRates.find((rate) => rate.date === formattedTimestamp)
        if (!rateForDate) {
          const rates = await getCurrenciesRate(formattedTimestamp, [currency])
          rateForDate = rates[0]
        }
        const { rate, quantity } = rateForDate.currencies.find(
          (c) => c.code === transaction.currency,
        )!
        transaction.conversion = {
          fromCurrency: transaction.currency,
          toCurrency: 'GEL',
          rate,
          resultAmount: +((transaction.amount * rate) / quantity).toFixed(2),
        }
      }

      resTransactions.push(transaction)
    }
  }

  return resTransactions
}

import { getCurrenciesRate } from '@/api/getCurrenciesRate'
import { getCurrenciesRatesRange } from '@/api/getCurrenciesRatesRange'
import type { TransactionExpanded } from '@/stores/transactions'
import type { CurrencyUnion } from '@/types/currencyUnion'
import { format } from 'date-fns'
import _ from 'lodash'

const GELtoGELRate = {
  rate: 1,
  quantity: 1,
}

export const convertTransactionToCurrency = async (
  transactions: TransactionExpanded[],
  currency: CurrencyUnion = 'USD',
) => {
  // We need to sort to ensure that cache will be the same for same set of currencies (it is better to do it on a backend but I dont care)
  const currenciesList = _.sortBy([...new Set(transactions.map((t) => t.currency)).add(currency)].filter(
    (c) => c !== 'GEL',
  ), (v) => v)

  const resTransactions: TransactionExpanded[] = []

  const { beginDate, endDate } = transactions.reduce(
    (acc, transaction) => {
      if (transaction.currency === 'GEL') {
        return acc
      }
      if (acc.beginDate === '' || new Date(transaction.timestamp) < new Date(acc.beginDate)) {
        acc.beginDate = transaction.timestamp
      }
      if (acc.endDate === '' || new Date(transaction.timestamp) > new Date(acc.endDate)) {
        acc.endDate = transaction.timestamp
      }
      return acc
    },
    { beginDate: '', endDate: '' },
  )

  const currenciesRates =
    beginDate && endDate
      ? await getCurrenciesRatesRange(
          new Date(beginDate).toISOString(),
          new Date(endDate).toISOString(),
          currenciesList,
        )
      : []

  for (const transaction of transactions) {
    if (transaction.currency === currency) {
      transaction.conversion = {
        fromCurrency: transaction.currency,
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
        const formattedTimestamp = format(new Date(transaction.timestamp), 'yyyy-MM-dd')
        const rates = await getCurrenciesRate(formattedTimestamp, currenciesList)
        rateForDate = rates[0]
      }

      const currenciesPair = rateForDate.currencies.filter(
        (c) => c.code === transaction.currency || c.code === currency,
      )
      const ourCurrencyRate =
        currenciesPair.find((c) => c.code === transaction.currency) || GELtoGELRate
      const toCurrencyRate = currenciesPair.find((c) => c.code === currency) || GELtoGELRate

      const currencyRate =
        ourCurrencyRate.rate /
        ourCurrencyRate.quantity /
        (toCurrencyRate.rate / toCurrencyRate.quantity)

      transaction.conversion = {
        fromCurrency: transaction.currency,
        toCurrency: currency,
        rate: currencyRate,
        resultAmount: +(transaction.amount * currencyRate).toFixed(2),
      }
    }

    resTransactions.push(transaction)
  }

  return resTransactions
}

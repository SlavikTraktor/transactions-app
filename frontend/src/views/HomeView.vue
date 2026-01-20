<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import _ from 'lodash'
import { BACKEND_URL } from '@/constants'
import { toast } from 'vue-sonner'
import EndSnack from '@/components/EndSnack.vue'
import { format } from 'date-fns'
import OutlineButton from '@/components/ui/OutlineButton.vue'
import STd from '@/components/ui/Table/STd.vue'
import STable from '@/components/ui/Table/STable.vue'
import STr from '@/components/ui/Table/STr.vue'
import SThead from '@/components/ui/Table/SThead.vue'
import STh from '@/components/ui/Table/STh.vue'
import STBody from '@/components/ui/Table/STBody.vue'

interface Transaction {
  uuid: string
  timestamp: string
  amount: number
  description: string
  sender: string
  currency: string
  source_type: string
  conversion?: {
    fromCurrency: string
    toCurrency: string
    rate: number
    resultAmount: number
  }
}

const transactions = ref<Transaction[]>([])
const error = ref<string | null>(null)

const loadData = async () => {
  try {
    // Делаем GET запрос
    const response = await axios.get(`${BACKEND_URL}api/transactions`)
    // В axios данные всегда лежат в поле .data
    transactions.value = response.data
  } catch (err) {
    error.value = 'Не удалось загрузить данные'
    console.error(err)
  }
}

const makeConvertation = async () => {
  const transactionsToConverse = transactions.value.filter((t) => t.currency !== 'GEL')

  const sortedTransactions = _.sortBy(transactionsToConverse, 'timestamp')

  const beginDate = sortedTransactions[0]?.timestamp
  const endDate = sortedTransactions[sortedTransactions.length - 1]?.timestamp

  const currenciesRates = await axios
    .get(`${BACKEND_URL}api/currenciesrate`, {
      params: {
        startDate: beginDate,
        endDate: endDate,
        ccy: 'USD',
      },
    })
    .then((response) => {
      // console.log('Currency rates:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching currency rates:', error)
    })

  for (const transaction of transactionsToConverse) {
    const formattedTimestamp = format(
      new Date(transaction.timestamp),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rateForDate = currenciesRates.find((rate: any) => rate.date === formattedTimestamp)
    if (rateForDate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { rate } = rateForDate.currencies.find((c: any) => c.code === transaction.currency)
      transaction.conversion = {
        fromCurrency: transaction.currency,
        toCurrency: 'GEL',
        rate,
        resultAmount: +(transaction.amount * rate).toFixed(2),
      }
    }
    const index = transactions.value.findIndex((t) => t.uuid === transaction.uuid)
    if (index !== -1) {
      transactions.value[index]!.conversion = transaction.conversion
    }
  }

  console.log('Updated transactions with conversion:', transactions.value)
  toast.success(EndSnack, { closeButton: true })
}

onMounted(loadData)
</script>

<template>
  <main class="py-4 px-5">
    <OutlineButton class="mb-2" @click="() => makeConvertation()">Make conversion</OutlineButton>
    <STable>
      <SThead>
        <STr>
          <STh>UUID</STh>
          <STh>Timestamp</STh>
          <STh>Amount</STh>
          <STh>Amount (GEL)</STh>
          <!-- <STh>Description</STh> -->
          <STh>Sender</STh>
          <STh>Currency</STh>
          <STh>Source Type</STh>
        </STr>
      </SThead>
      <STBody>
        <STr v-for="transaction in transactions" :key="transaction.uuid">
          <STd>{{ transaction.uuid }}</STd>
          <STd>{{ transaction.timestamp }}</STd>
          <STd>{{ transaction.amount }}</STd>
          <STd>
            {{
              transaction.currency === 'GEL'
                ? transaction.amount
                : transaction.conversion?.resultAmount
            }}
          </STd>
          <!-- <STd >{{ transaction.description }}</STd> -->
          <STd>{{ transaction.sender }}</STd>
          <STd>{{ transaction.currency }}</STd>
          <STd>{{ transaction.source_type }}</STd>
        </STr>
      </STBody>
    </STable>
  </main>
</template>

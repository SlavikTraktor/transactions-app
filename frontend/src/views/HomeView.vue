<script setup lang="ts">
import { ref, onMounted } from 'vue'
import _ from 'lodash'
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
import { getCurrenciesRatesRange } from '@/api/getCurrencies'
import { getTransactions, type Transaction } from '@/api/getTransactions'
import SSidebar from '@/components/ui/SSidebar.vue'
import TableFilters from '@/components/TableFilters/TableFilters.vue'

type TransactionExpanded = Transaction & {
  conversion?: {
    fromCurrency: string
    toCurrency: string
    rate: number
    resultAmount: number
  }
}

const transactions = ref<TransactionExpanded[]>([])
const error = ref<string | null>(null)
const isSidebarOpen = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)

const loadData = async () => {
  try {
    transactions.value = await getTransactions()
  } catch (err) {
    error.value = 'Не удалось загрузить данные'
    console.error(err)
  }
}

const openSidebar = () => {
  isSidebarOpen.value = true
}

const openModal = () => {
  isModalOpen.value = true
}

const makeConversion = async () => {
  const transactionsToConverse = transactions.value.filter((t) => t.currency !== 'GEL')

  const sortedTransactions = _.sortBy(transactionsToConverse, 'timestamp')

  if (sortedTransactions.length === 0) {
    toast.error('Нет транзакций для конвертации')
    return
  }

  const beginDate = sortedTransactions[0]?.timestamp
  const endDate = sortedTransactions[sortedTransactions.length - 1]?.timestamp

  const currenciesRates = await getCurrenciesRatesRange(beginDate!, endDate!, ['USD'])

  for (const transaction of transactionsToConverse) {
    const formattedTimestamp = format(
      new Date(transaction.timestamp),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    )

    const rateForDate = currenciesRates.find((rate) => rate.date === formattedTimestamp)
    if (rateForDate) {
      const { rate } = rateForDate.currencies.find((c) => c.code === transaction.currency)!
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
    <OutlineButton class="mb-2 mr-2" @click="() => makeConversion()">Make conversion</OutlineButton>
    <OutlineButton class="mb-2 mr-2" @click="() => openSidebar()">Open sidebar</OutlineButton>
    <OutlineButton class="mb-2" @click="() => openModal()">Open modal</OutlineButton>
    <SSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false">
      <p>Sidebar content goes here.</p>
    </SSidebar>
    <TableFilters :isOpen="isModalOpen" @close="isModalOpen = false" />
    <STable>
      <SThead>
        <STr>
          <STh>UUID</STh>
          <STh>Timestamp</STh>
          <STh>Amount</STh>
          <STh>Amount (GEL)</STh>
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
          <STd>{{ transaction.sender }}</STd>
          <STd>{{ transaction.currency }}</STd>
          <STd>{{ transaction.source_type }}</STd>
        </STr>
      </STBody>
    </STable>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, effect } from 'vue'
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
import SSidebar from '@/components/ui/SSidebar.vue'
import TableFiltersButton from '@/components/TableFilters/TableFiltersButton.vue'
import { useTransactionsStore } from '@/stores/transactions'
import SummaryButton from '@/components/SummaryModal/SummaryButton.vue'

const error = ref<string | null>(null)
const isSidebarOpen = ref<boolean>(false)

const transactionsStore = useTransactionsStore()

const openSidebar = () => {
  isSidebarOpen.value = true
}

const makeConversion = async () => {
  const transactionsByCurrency = _.groupBy(transactionsStore.transactions, 'currency')

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
      }

      const index = transactionsStore.transactions.findIndex((t) => t.uuid === transaction.uuid)
      if (index !== -1) {
        transactionsStore.transactions[index]!.conversion = transaction.conversion
      }
    }
  }
  toast.success(EndSnack, { closeButton: true })
}

effect(() => {
  if (error.value) {
    toast.error(error.value)
  }
})

onMounted(() => {
  if (transactionsStore.transactions.length === 0) {
    transactionsStore.loadTransactions()
  }
})
</script>

<template>
  <main class="py-4 px-5">
    <div class="flex gap-2 mb-2">
      <OutlineButton @click="() => makeConversion()">Конвертировать</OutlineButton>
      <OutlineButton @click="() => openSidebar()">Open sidebar</OutlineButton>
      <TableFiltersButton />
      <SummaryButton />
    </div>
    <SSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false">
      <p>Sidebar content goes here.</p>
    </SSidebar>
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
        <STr v-for="transaction in transactionsStore.transactions" :key="transaction.uuid">
          <STd>{{ transaction.uuid }}</STd>
          <STd>{{ transaction.timestamp }}</STd>
          <STd>{{ transaction.amount }}</STd>
          <STd>
            {{ transaction.conversion?.resultAmount }}
          </STd>
          <STd>{{ transaction.sender }}</STd>
          <STd>{{ transaction.currency }}</STd>
          <STd>{{ transaction.source_type }}</STd>
        </STr>
      </STBody>
    </STable>
  </main>
</template>

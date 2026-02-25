<script setup lang="ts">
import { markRaw, onMounted, toRaw, watch } from 'vue'
import { toast } from 'vue-sonner'
import EndSnack from '@/components/EndSnack.vue'
import STd from '@/components/ui/Table/STd.vue'
import STable from '@/components/ui/Table/STable.vue'
import STr from '@/components/ui/Table/STr.vue'
import STHead from '@/components/ui/Table/STHead.vue'
import STh from '@/components/ui/Table/STh.vue'
import STBody from '@/components/ui/Table/STBody.vue'
import TableFiltersButton from '@/components/TableFilters/TableFiltersButton.vue'
import { useTransactionsStore, type TransactionExpanded } from '@/stores/transactions'
import SummaryButton from '@/components/SummaryModal/SummaryButton.vue'
import { convertTransactionToCurrency } from '@/helpers/convertTransactionToCurrency'
import { useTransactionDetailStore } from '@/stores/transactionDetail'
import TransactionDetailSidebar from '@/components/TransactionDetailSidebar/TransactionDetailSidebar.vue'
import ConvertedAmountTh from '@/components/ConvertedAmountTh.vue'
import { useConversionStore } from '@/stores/conversionStore'

const transactionsStore = useTransactionsStore()
const transactionDetailStore = useTransactionDetailStore()
const conversionStore = useConversionStore()

const openTransactionDetail = (t: TransactionExpanded) => {
  transactionDetailStore.showDetail(t)
}

watch(
  [() => transactionsStore.isLoaded, () => conversionStore.currency],
  (isLoaded) => {
    if (isLoaded) {
      makeConversion()
    }
  },
)

const makeConversion = async () => {
  const convertedTransactions = await convertTransactionToCurrency(
    structuredClone(toRaw(transactionsStore.transactions)),
    conversionStore.currency,
  )

  convertedTransactions.forEach((transaction) => {
    const index = transactionsStore.transactions.findIndex((t) => t.uuid === transaction.uuid)
    if (index !== -1) {
      transactionsStore.transactions[index]!.conversion = transaction.conversion
    }
  })

  toast.success(markRaw(EndSnack), { closeButton: true })
}

onMounted(() => {
  if (transactionsStore.transactions.length === 0) {
    transactionsStore.loadTransactions()
  }
})
</script>

<template>
  <main class="py-4 px-5">
    <div class="flex gap-2 mb-2">
      <TableFiltersButton />
      <SummaryButton />
    </div>
    <TransactionDetailSidebar />
    <STable>
      <STHead>
        <STr>
          <STh>#</STh>
          <STh>Timestamp</STh>
          <STh>Amount</STh>
          <ConvertedAmountTh />
          <STh>Sender</STh>
          <STh>Currency</STh>
          <STh>Source Type</STh>
        </STr>
      </STHead>
      <STBody>
        <STr v-for="(transaction, index) in transactionsStore.transactions" :key="transaction.uuid">
          <STd
            class="cursor-pointer hover:text-lime-600"
            @click="() => openTransactionDetail(transaction)"
            >{{ index + 1 }}</STd
          >
          <STd>{{ transaction.timestamp.slice(0, -9) }}</STd>
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

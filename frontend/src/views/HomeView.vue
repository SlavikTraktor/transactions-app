<script setup lang="ts">
import { markRaw, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import EndSnack from '@/components/EndSnack.vue'
import OutlineButton from '@/components/ui/OutlineButton.vue'
import STd from '@/components/ui/Table/STd.vue'
import STable from '@/components/ui/Table/STable.vue'
import STr from '@/components/ui/Table/STr.vue'
import SThead from '@/components/ui/Table/SThead.vue'
import STh from '@/components/ui/Table/STh.vue'
import STBody from '@/components/ui/Table/STBody.vue'
import TableFiltersButton from '@/components/TableFilters/TableFiltersButton.vue'
import { useTransactionsStore, type TransactionExpanded } from '@/stores/transactions'
import SummaryButton from '@/components/SummaryModal/SummaryButton.vue'
import { convertTransactionToGELCurrency } from '@/helpers/convertTransactionToCurrency'
import { useTransactionDetailStore } from '@/stores/transactionDetail'
import TransactionDetailSidebar from '@/components/TransactionDetailSidebar/TransactionDetailSidebar.vue'

const transactionsStore = useTransactionsStore()
const transactionDetailStore = useTransactionDetailStore()

const openTransactionDetail = (t: TransactionExpanded) => {
  transactionDetailStore.showDetail(t)
}

const makeConversion = async () => {
  const convertedTransactions = await convertTransactionToGELCurrency(
    transactionsStore.transactions,
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
      <OutlineButton @click="() => makeConversion()">Конвертировать</OutlineButton>
      <TableFiltersButton />
      <SummaryButton />
    </div>
    <TransactionDetailSidebar />
    <STable>
      <SThead>
        <STr>
          <STh>#</STh>
          <STh>Timestamp</STh>
          <STh>Amount</STh>
          <STh>Amount (GEL)</STh>
          <STh>Sender</STh>
          <STh>Currency</STh>
          <STh>Source Type</STh>
        </STr>
      </SThead>
      <STBody>
        <STr v-for="(transaction, index) in transactionsStore.transactions" :key="transaction.uuid">
          <STd
            class="cursor-pointer hover:text-lime-600"
            @click="() => openTransactionDetail(transaction)"
            >{{ index + 1 }}</STd
          >
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

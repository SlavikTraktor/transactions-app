<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { BACKEND_URL } from '@/constants'

interface Transaction {
  uuid: string
  timestamp: string
  amount: number
  description: string
  sender: string
  currency: string
  source_type: string
}

const posts = ref<Transaction[]>([])
const error = ref<string | null>(null)

const loadData = async () => {
  try {
    // Делаем GET запрос
    const response = await axios.get(`${BACKEND_URL}api/transactions`)
    console.log(response.data)
    // В axios данные всегда лежат в поле .data
    posts.value = response.data
  } catch (err) {
    error.value = 'Не удалось загрузить данные'
    console.error(err)
  }
}

onMounted(loadData)
</script>

<template>
  <main>
    <table>
      <thead>
        <tr>
          <th>UUID</th>
          <th>Timestamp</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Sender</th>
          <th>Currency</th>
          <th>Source Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.uuid">
          <td>{{ post.uuid }}</td>
          <td>{{ post.timestamp }}</td>
          <td>{{ post.amount }}</td>
          <td>{{ post.description }}</td>
          <td>{{ post.sender }}</td>
          <td>{{ post.currency }}</td>
          <td>{{ post.source_type }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

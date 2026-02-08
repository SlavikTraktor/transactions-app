export interface CurrencyRate {
  code: string //'USD'
  date: string //'2025-12-11T17:01:14.550Z'
  diff: number //-0.0004
  diffFormated: string //'0.0004'
  name: string //'აშშ დოლარი'
  quantity: number // 1
  rate: number //2.6991
  rateFormated: string //'2.6991'
  validFromDate: string //'2025-12-12T00:00:00.000Z'
}

export interface CurrenciesRate {
  date: string
  currencies: CurrencyRate[]
}
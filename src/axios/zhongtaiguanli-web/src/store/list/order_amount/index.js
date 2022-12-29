import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'order_amount'

export default listVuexGenerator({
  type,
  query: {},

  listApi: api.order_amount.list,
  countApi: api.order_amount.count,
})

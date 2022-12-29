import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'charge_back_amount'

export default listVuexGenerator({
  type,
  query: {},

  listApi: api.charge_back_amount.list,
  countApi: api.charge_back_amount.count,
})

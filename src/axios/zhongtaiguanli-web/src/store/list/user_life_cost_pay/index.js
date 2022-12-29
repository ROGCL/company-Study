import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'user_life_cost_pay'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.user_life_cost_pay.list,
  countApi: api.user_life_cost_pay.count,
})

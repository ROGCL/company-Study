import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'user_life_cost'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.user_life_cost.list,
  countApi: api.user_life_cost.count,
})

import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'return_on_investment'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.return_on_investment.list,
  countApi: api.return_on_investment.count,
})

import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'all_income'

export default listVuexGenerator({
  type,
  query: {},

  listApi: api.all_income.list,
  countApi: api.all_income.count,
})

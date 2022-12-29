import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'ad_income'

export default listVuexGenerator({
  type,
  query: {},

  listApi: api.ad_income.list,
  countApi: api.ad_income.count,
})
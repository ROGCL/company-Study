import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'converse_rate'

export default listVuexGenerator({
  type,
  query: {},

  listApi: api.converse_rate.list,
  countApi: api.converse_rate.count,
})

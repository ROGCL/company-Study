import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'keep_lt'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.keep_lt.list,
  countApi: api.keep_lt.count,
})

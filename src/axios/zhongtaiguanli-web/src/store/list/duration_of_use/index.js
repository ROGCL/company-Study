import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'duration_of_use'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.duration_of_use.list,
  countApi: api.duration_of_use.count,
})

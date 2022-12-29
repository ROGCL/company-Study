import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'user_from'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.user_from.list,
  countApi: api.user_from.count,
})

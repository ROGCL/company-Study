import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'user_value'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.user_value.list,
  countApi: api.user_value.count,
})

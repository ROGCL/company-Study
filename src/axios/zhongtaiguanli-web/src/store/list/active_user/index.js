import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'active_user'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.active_user.list,
  countApi: api.active_user.count,
})

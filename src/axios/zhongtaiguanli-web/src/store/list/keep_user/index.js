import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'keep_user'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.keep_user.list,
  countApi: api.keep_user.count,
})

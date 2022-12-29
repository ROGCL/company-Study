import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'new_user'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.new_user.list,
  countApi: api.new_user.count,
})

import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'active_user_keep'

export default listVuexGenerator({
  type,
  query: {},

  listApi: api.active_user_keep.list,
  countApi: api.active_user_keep.count,
})

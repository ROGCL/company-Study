import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'down_active'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.down_active.list,
  countApi: api.down_active.count,
})

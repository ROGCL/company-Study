import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'user_life'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.user_life.list,
  countApi: api.user_life.count,
})

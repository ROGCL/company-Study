import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'churn_user'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.churn_user.list,
  countApi: api.churn_user.count,
})

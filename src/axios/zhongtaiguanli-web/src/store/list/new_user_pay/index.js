import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'new_user_pay'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.new_user_pay.list,
  countApi: api.new_user_pay.count,
})

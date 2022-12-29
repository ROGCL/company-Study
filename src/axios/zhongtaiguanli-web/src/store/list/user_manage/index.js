import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'user_manage'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.User.list,
  removeApi: api.User.remove,
  addApi: api.User.add,
  editApi: api.User.edit,
  detailApi: api.User.detail
})

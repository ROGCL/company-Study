import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'app_manage'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.App.list,
  removeApi: api.App.remove,
  addApi: api.App.add,
  editApi: api.App.edit,
  detailApi: api.App.detail
})

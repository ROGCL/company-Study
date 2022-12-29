import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'put_in_data_count'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.put_in_data_count.list,
  countApi: api.put_in_data_count.count,
})

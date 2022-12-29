import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'start_times'

export default listVuexGenerator({
  type,
  query: {},
  
  listApi: api.start_times.list,
  countApi: api.start_times.count,
  leadApi: api.start_times.count
})

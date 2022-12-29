import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'order_funnel'

export default listVuexGenerator({
    type,
    query: {},

    listApi: api.order_funnel.list,
    countApi: api.order_funnel.count,
})

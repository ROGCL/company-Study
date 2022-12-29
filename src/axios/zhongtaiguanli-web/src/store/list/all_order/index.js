import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'all_order'

export default listVuexGenerator({
	type,
	query: {},

	listApi: api.all_order.list,
	countApi: api.all_order.count,
	leadApi: api.all_order.count
})

import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'order_income_origin'

export default listVuexGenerator({
	type,
	query: {},

	listApi: api.order_income_origin.list,
	countApi: api.order_income_origin.count,
	leadApi: api.order_income_origin.count
})

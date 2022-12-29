import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'order_income'

export default listVuexGenerator({
	type,
	query: {},

	listApi: api.order_income.list,
	countApi: api.order_income.count,
	leadApi: api.order_income.count
})

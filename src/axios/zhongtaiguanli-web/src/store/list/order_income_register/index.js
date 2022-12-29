import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'order_income_register'

export default listVuexGenerator({
	type,
	query: {},

	listApi: api.order_income_register.list,
	countApi: api.order_income_register.count,
	leadApi: api.order_income_register.count
})

import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'registered_user'

export default listVuexGenerator({
	type,
	query: {},

	listApi: api.registered_user.list,
	countApi: api.registered_user.count,
	leadApi: api.registered_user.count
})

import { listVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'SDK_count'

export default listVuexGenerator({
	type,
	query: {},

	listApi: api.SDK_count.list,
	countApi: api.SDK_count.count,
	leadApi: api.SDK_count.count
})

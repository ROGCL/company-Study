import {listVuexGenerator} from '@/util/vuexGennerator'
import {api} from '@/config/api'

const type = 'ad_index'

export default listVuexGenerator({
	type,
	query: {},
	listApi: api.ad_index.list,
	countApi: api.ad_index.count,
	leadApi: api.ad_index.count,
})

// 渠道字典相关信息
import { dictVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'ad_app'

export default dictVuexGenerator({
	type,
	api: api.Ads.ad_app,

})

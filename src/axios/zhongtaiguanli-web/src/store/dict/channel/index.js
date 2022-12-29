// 渠道字典相关信息
import { dictVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'channel'

export default dictVuexGenerator({
	type,
	api: api.Dict.channel
})

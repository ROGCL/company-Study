// app版本字典相关信息
import { dictVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'app_version'

export default dictVuexGenerator({
	type,
	api: api.Dict.app_version
})

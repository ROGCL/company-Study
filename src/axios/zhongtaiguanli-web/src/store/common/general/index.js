// app字典相关信息
import { commonVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'general'

export default commonVuexGenerator({
	type,
	api: api.General
})

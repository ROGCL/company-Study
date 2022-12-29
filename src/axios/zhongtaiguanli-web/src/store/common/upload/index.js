// app字典相关信息
import { commonVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'upload'

export default commonVuexGenerator({
	type,
	api: api.lead_in.upload
})

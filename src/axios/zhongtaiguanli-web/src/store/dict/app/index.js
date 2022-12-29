// app字典相关信息
import { dictVuexGenerator } from '@/util/vuexGennerator'
import { api } from '@/config/api'

const type = 'app'

export default dictVuexGenerator({
	type,
	api: api.Dict.app,
	getters: {
		getCurrentApp: (state) => (appId) => {
			return state.data.find(v => v.id === appId) || {}
		}
	}
})

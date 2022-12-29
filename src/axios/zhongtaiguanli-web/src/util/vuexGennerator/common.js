import _ from 'lodash'
import axios from '@/util/axios'

import { getName } from './util'

export default ({
  type = '',
  state = {},
  params = {},
  getters = {},
  mutations = {},
  actions = {},
  api = ''
}) => {


  const initState = {
    loading: false,
    init: false,
    data: [],
    query: {},
    msg: '',

    ...state
  }

  const _initState = _.clone(initState)

  if (!_.isPlainObject(mutations)) {
    return
  }

  const typeUc = type.toUpperCase()

  const COMMON_SUCCESS = `${typeUc}_SUCCESS`
  const COMMON_RESET = `${typeUc}_RESET`
  const COMMON_LOADING = `${typeUc}_LOADING`
  const COMMON_LOADED = `${typeUc}_LOADED`

  mutations = _.extend(mutations, {
    [COMMON_SUCCESS](state, payload) {
      state = _.extend(
        state,
        payload
      )
      state.msg = ''
    },
    [COMMON_RESET](state, payload) {
      state = _.extend(state, _initState)
    },
    [COMMON_LOADING](state, payload) {
      state.loading = true
    },
    [COMMON_LOADED](state, payload) {
      state.loading = false
    }
  })

  return {
    state: initState,
    getters: getters,
    mutations: mutations,
    actions: _.extend(actions, {
      [getName(type, 'get')]: async ({ state, commit, rootState }, _params = {}) => {
        const {
          loading,
          query,
          data,
          init
        } = state

        const assignParams = Object.assign({}, params, _params)
        const { ignore = true } = assignParams

        if (!ignore && init && _.isEqual(query, assignParams)) {
          return [null, data]
        }

        commit(COMMON_RESET)
        commit(COMMON_LOADING)

        const [err, res] = await axios.post(api, assignParams)

        commit(COMMON_LOADED)

        if (err) {
          return [err]
        }

        commit(COMMON_SUCCESS, {
          init: true,
          data: res,
          query: assignParams
        })

        return [null, res]
      }
    })
  }
}

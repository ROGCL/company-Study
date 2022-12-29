import _ from 'lodash'
import axios from '@/util/axios'

import { getName } from './util'

export default ({
  type = '',
  state = {},
  params = {},
  mutations = {},
  getters = {},
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

  if (!_.isPlainObject(mutations)) {
    return
  }

  const typeUc = type.toUpperCase()

  const DICT_SUCCESS = `DICT_${ typeUc }_SUCCESS`
  const DICT_RESET = `DICT_${ typeUc }_RESET`
  const DICT_LOADING = `DICT_${ typeUc }_LOADING`
  const DICT_LOADED = `DICT_${ typeUc }_LOADED`

  mutations = _.extend(mutations, {
    [ DICT_SUCCESS ] (state, payload) {
      state = _.extend(
        state,
        payload
      )
      state.msg = ''
    },
    [ DICT_RESET ] (state, payload) {
      state = initState
    },
    [ DICT_LOADING ] (state, payload) {
      state.loading = true
    },
    [ DICT_LOADED ] (state, payload) {
      state.loading = false
    }
  })

  return {
    state: initState,
    getters: getters,
    mutations: mutations,
    actions: _.extend(actions, {
      [ getName(type, 'get') ]: async ({ state, commit, rootState }, _params = {}) => {
        const {
          loading,
          query,
          data,
          init
        } = state

        const assignParams = Object.assign({}, params, _params)
        const { ignore = true } = _params

        if (!ignore && init && _.isEqual(query, assignParams)) {
          return [ null, data ]
        }

        commit(DICT_LOADING)

        const [ err, res ] = await axios.post(api, assignParams)

        commit(DICT_LOADED)

        if (err) {
          return [ err ]
        }

        commit(DICT_SUCCESS, {
          init: true,
          data: res,
          query: assignParams
        })

        return [ null, res ]
      }
    })
  }
}

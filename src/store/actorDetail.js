import { request } from './axios'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    personId: 0,
    actorDetail: {},
    actorCredits: {
      cast: [],
      crew: []
    },
    actorImages: {}
  },
  mutations: {
    SET_PERSON_ID (state, personId) {
      state.personId = personId
    },
    SET_ACTOR_DETAIL (state, data) {
      state.actorDetail = data
    },
    SET_ACTOR_CREDITS (state, data) {
      state.actorCredits = data
    },
    SET_ACTOR_IMAGES (state, data) {
      state.actorImages = data
      // console.log(state.actorImages);
      // console.log(typeof state.actorImages);
      // // todo Array인데 왜 Object인지 찾기
    }
  },
  actions: {
    async getActorDetail ({ state, commit }) {
      // 영어 정보라도 가져오기 위함
      const result = await axios.create({
        baseURL: 'https://api.themoviedb.org/3',
        params: {
          api_key: '4ae7e3c1afba212f2a37c1e33792869c'
        }
      })(`/person/${state.personId}`)

      // api 호출 성공 시
      if (result.status === 200) {
        commit('SET_ACTOR_DETAIL', result.data)
      }
    },
    async getActorCredits ({ state, commit }) {
      const result = await request(
        `/person/${state.personId}/combined_credits`
      )

      // api 호출 성공 시
      if (result.status === 200) {
        result.data.crew.sort((a, b) => {
          if (a.release_date < b.release_date) {
            return 1
          }
          if (a.release_date > b.release_date) {
            return -1
          }
          return 0
        })

        result.data.cast.sort((a, b) => {
          if (a.release_date < b.release_date) {
            return 1
          }
          if (a.release_date > b.release_date) {
            return -1
          }
          return 0
        })

        commit('SET_ACTOR_CREDITS', result.data)
      }
    },
    async getActorImages ({ state, commit }) {
      const result = await request(`/person/${state.personId}/images`)

      // api 호출 성공 시
      if (result.status === 200) {
        commit('SET_ACTOR_IMAGES', result.data.profiles)
      }
    }
  }
}

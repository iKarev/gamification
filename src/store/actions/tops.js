import axios from 'axios'
// const url = 'http://127.0.0.1:3000'

export default {
  saveTopToServer ({ commit }, top) {
    axios.post(`api/tops`, top).then((response) => {
      top._id = response.data.createdTop._id
      commit('addTopToList', top)
    })
  },
  updateTop ({ commit }, top) {
    const data = [
      {'propName': 'name', 'value': top.name}
    ]
    if (top.target) {
      data.push({'propName': 'targetId', 'value': top.target._id})
      data.push({'propName': 'targetName', 'value': top.target.name})
    }
    if (top.done !== undefined) {
      data.push({'propName': 'done', 'value': top.done})
    }
    axios.patch(`api/tops/${top._id}`, data).then((response) => {
      commit('updateTop', top)
    })
  },
  getTopsFromServer ({ commit, state }, data) {
    let query = ``
    if (data) {
      for (const i in data) {
        query += query.length < 1 ? `?${i}=${data[i]}` : `&${i}=${data[i]}`
      }
    }
    const params = {}
    if (state.activeFriend._id) { params.friendId = state.activeFriend._id }
    axios.get(`api/tops${query}`, {params}).then((response) => {
      const tops = []
      if (response.data.length) {
        for (let i = 0; i < 5; i++) {
          const top = response.data.find(t => t.type === i)
          tops[i] = top || {price: null, name: '', description: '', target: {}}
          tops[i].type = i
        }
      } else {
        for (let i = 0; i < 5; i++) {
          tops[i] = {type: i, price: null, name: '', description: '', target: {}}
        }
      }
      commit('setTopsList', tops)
    })
  },
  getTopFromServer ({ commit }, topId) {
    axios.get(`api/tops/${topId}`).then((response) => {
      const top = response.data.top
      const editTop = {
        deadline: top.deadline,
        name: top.name,
        _id: top._id,
        target: { name: top.targetName, _id: top.targetId }
      }
      commit('setActiveTop', editTop)
    })
  },
  deleteTop ({ commit }, topId) {
    axios.delete(`api/tops/${topId}`).then((response) => {
      commit('deleteTop', topId)
    })
  }
}

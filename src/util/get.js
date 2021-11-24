const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return axios.get('https://api.github.com/orgs/cacli-templates/repos')
}

// 获取版本信息
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/cacli-templates/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}
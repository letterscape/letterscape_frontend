import axios, { baseUrl } from '@/lib/axios'

export const spaceApi = {
  create (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/space/create`,
      data: params
    }).then(res => res.data)
  },

  publish (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/space/publish`,
      data: params
    }).then(res => res.data)
  },

  page (params: any) {   
    return axios({
      method: 'get',
      url: `${baseUrl}/space/page`,
      params
    }).then(res => res.data)
  },

  info (params: any) {   
    return axios({
      method: 'get',
      url: `${baseUrl}/space/info`,
      params
    }).then(res => res.data)
  },

  upload (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/space/upload`,
      data: params
    }).then(res => res.data)
  },

  fetch (params: any) {
    return axios({
      method: 'get',
      url: `${baseUrl}/space/fetch`,
      params
    }).then(res => res.data)
  },
}
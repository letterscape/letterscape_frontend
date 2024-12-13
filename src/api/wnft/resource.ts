import axios, { baseUrl } from '@/lib/axios'

export const wnftResrouceApi = {
  save (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/resource/save`,
      data: params
    }).then(res => res.data)
  },
  
  find (params: any) {
    return axios({
      method: 'get',
      url: `${baseUrl}/resource/find`,
      params
    }).then(res => res.data)
  },
  upload (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/resource/upload`,
      data: params
    }).then(res => res.data)
  },
  
  fetch (params: any) {
    return axios({
      method: 'get',
      url: `${baseUrl}/resource/fetch`,
      params
    }).then(res => res.data)
  },
}

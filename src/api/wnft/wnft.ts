import axios, { baseUrl } from '@/lib/axios'


export const wnftApi =  {
  page (params: any) {   
    return axios({
      method: 'get',
      url: `${baseUrl}/wnftInfo/page`,
      params
    }).then(res => res.data)
  },

  detail (params: any) {
    return axios({
      method: 'get',
      url: `${baseUrl}/wnftInfo/detail`,
      params
    }).then(res => res.data)
  },

  mint (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/wnftInfo/mint`,
      data: params
    }).then(res => res.data)
  },

  list (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/wnftInfo/list`,
      data: params
    }).then(res => res.data)
  },

  buy (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/wnftInfo/buy`,
      data: params
    }).then(res => res.data)
  },

  burn (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/wnftInfo/burn`,
      data: params
    }).then(res => res.data)
  },

  payHoldfee (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/wnftInfo/holdfee`,
      data: params
    }).then(res => res.data)
  },

  updateDetail (params: any) {
    return axios({
      method: 'post',
      url: `${baseUrl}/wnftInfo/updateDetail`,
      data: params
    }).then(res => res.data)
  },
} 
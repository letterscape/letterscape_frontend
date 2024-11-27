import axios, { baseUrl } from '@/lib/axios'

export const wnftStatApi = {
  priceStat (params: any) {   
    return axios({
      method: 'get',
      url: `${baseUrl}/stat/price`,
      params
    }).then(res => res.data)
  },
  tradePage (params: any) {   
    return axios({
      method: 'get',
      url: `${baseUrl}/stat/trade`,
      params
    }).then(res => res.data)
  },
  transactionPage (params: any) {   
    return axios({
      method: 'get',
      url: `${baseUrl}/stat/transaction`,
      params
    }).then(res => res.data)
  },
}
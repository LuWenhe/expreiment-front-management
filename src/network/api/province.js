import { request } from '@/network/request/request'

export const getProvinces = () => {
  return request({
    method: 'GET',
    url: '/province/getAllProvinces'
  })
}

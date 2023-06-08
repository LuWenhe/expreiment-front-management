import { request } from '@/network/request/request'

export const getDashBoardInfo = () => {
  return request({
    method: 'GET',
    url: '/back/getDashBoardInfo'
  })
}

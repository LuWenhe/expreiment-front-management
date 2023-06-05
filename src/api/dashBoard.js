import { request } from '@/network/request'

export const getDashBoardInfo = () => {
  return request({
    method: 'GET',
    url: '/back/getDashBoardInfo'
  })
}

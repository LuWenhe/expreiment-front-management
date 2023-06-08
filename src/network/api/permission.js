import { request } from '@/network/request/request'

export const getMenuTree = (userId) => {
  return request({
    method: 'GET',
    url: '/permission/getMenu',
    params: {
      userId: userId
    }
  })
}

import { request } from '@/network/request'

export const getGuideBook = (sonId) => {
  return request({
    method: 'GET',
    url: '/front/getGuideBook',
    params: {
      sonId: sonId
    }
  })
}

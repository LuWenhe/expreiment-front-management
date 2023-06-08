import { request } from '@/network/request/request'

export const getGuideBook = (sonId) => {
  return request({
    method: 'GET',
    url: '/frontLesson/getGuideBook',
    params: {
      sonId: sonId
    }
  })
}

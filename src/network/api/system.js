import { request } from '@/network/request/request'

export const getAllBanners = (currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/banner/getAllBanner',
    params: {
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const updateBanner = (bannerObj) => {
  return request({
    method: 'POST',
    url: '/banner/updateBanner',
    data: bannerObj
  })
}

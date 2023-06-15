import { request } from '@/network/request'

export const getTagsByPage = (currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/backTag/getTagsByPage',
    params: {
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const getTags = () => {
  return request({
    method: 'GET',
    url: '/backTag/getTags'
  })
}

export const addTag = (tagObj) => {
  return request({
    method: 'POST',
    url: '/backTag/addTag',
    data: tagObj
  })
}

export const editTag = (tagObj) => {
  return request({
    method: 'POST',
    url: '/backTag/editTag',
    data: tagObj
  })
}

export const deleteTag = (tagId) => {
  return request({
    method: 'GET',
    url: '/backTag/delTag',
    params: {
      tagId: tagId
    }
  })
}

import { request } from '@/network/request'

export const getClazzListByTeacherId = (teacherId, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/clazz/getClazzList',
    params: {
      teacherId: teacherId,
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const addClazz = (clazzObj) => {
  return request({
    method: 'POST',
    url: '/clazz/addClazz',
    data: clazzObj
  })
}

export const updateClazz = (clazzObj) => {
  return request({
    method: 'POST',
    url: '/clazz/updateClazz',
    data: clazzObj
  })
}

export const deleteClazz = (clazzId) => {
  return request({
    method: 'GET',
    url: '/clazz/deleteClazz',
    params: {
      clazzId: clazzId
    }
  })
}

export const getStudentsByClazzId = (clazzId, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/clazz/getStudents',
    params: {
      clazzId: clazzId,
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

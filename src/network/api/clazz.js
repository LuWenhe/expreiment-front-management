import { request } from '@/network/request/request'

export const getClazzListByTeacherId = (teacherId, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/backClazz/getClazzList',
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
    url: '/backClazz/addClazz',
    data: clazzObj
  })
}

export const updateClazz = (clazzObj) => {
  return request({
    method: 'POST',
    url: '/backClazz/updateClazz',
    data: clazzObj
  })
}

export const deleteClazz = (clazzId) => {
  return request({
    method: 'GET',
    url: '/backClazz/deleteClazz',
    params: {
      clazzId: clazzId
    }
  })
}

export const getStudentsByClazzId = (clazzId, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/backClazz/getStudents',
    params: {
      clazzId: clazzId,
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

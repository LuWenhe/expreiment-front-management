import {request} from '@/network/request'

export const login = (userObj) => {
  return request({
    method: 'POST',
    url: '/user/backLogin',
    data: userObj
  })
}
export const logout = (userId) => {
  return request({
    method: 'POST',
    url: '/user/backLogout',
    data: userId
  })
}
export const deleteStudentsAndClazzByClazzId = (clazzId) => {
  return request({
    method: 'GET',
    url: '/backUser/deleteStudentsAndClazzByClazzId',
    params: {
      clazzId: clazzId
    }
  })
}
export const addStudent = (studentObj) => {
  return request({
    method: 'POST',
    url: '/backUser/addStudent',
    data: studentObj
  })
}
export const deleteUsers = (userIds) => {
  return request({
    method: 'POST',
    url: '/backUser/deleteUsersByIds',
    data: userIds
  })
}
export const editStudent = (studentObj) => {
  return request({
    method: 'POST',
    url: '/backUser/editStudent',
    data: studentObj
  })
}
export const addStudentFromExcel = (formData) => {
  return request({
    method: 'POST',
    url: '/backUser/uploadFromExcel',
    data: formData
  })
}
export const getAllTeachers = (currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/backUser/getAllTeachers',
    params: {
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}
export const loadAllTeachers = () => {
  return request({
    method: 'GET',
    url: '/backUser/loadAllTeachers'
  })
}
export const addTeacher = (teacherObj) => {
  return request({
    method: 'POST',
    url: '/backUser/addTeacher',
    data: teacherObj
  })
}
export const findTeacherByName = (realName, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/backUser/findTeacherByName',
    params: {
      realName: realName,
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}
export const editTeacher = (teacherObj) => {
  return request({
    method: 'POST',
    url: '/backUser/editTeacher',
    data: teacherObj
  })
}

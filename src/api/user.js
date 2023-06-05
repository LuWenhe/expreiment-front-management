import {request} from '@/network/request'

export const login = (userObj) => {
  return request({
    method: 'POST',
    url: '/user/login',
    data: userObj
  })
}

export const deleteStudentsAndClazzByClazzId = (clazzId) => {
  return request({
    method: 'GET',
    url: '/userBack/deleteStudentsAndClazzByClazzId',
    params: {
      clazzId: clazzId
    }
  })
}

export const addStudent = (studentObj) => {
  return request({
    method: 'POST',
    url: '/userBack/addStudent',
    data: studentObj
  })
}

export const deleteUsers = (userIds) => {
  return request({
    method: 'POST',
    url: '/userBack/deleteUsersByIds',
    data: userIds
  })
}

export const editStudent = (studentObj) => {
  return request({
    method: 'POST',
    url: '/userBack/editStudent',
    data: studentObj
  })
}

export const addStudentFromExcel = (formData) => {
  return request({
    method: 'POST',
    url: '/userBack/uploadFromExcel',
    data: formData
  })
}

export const getAllTeachers = (currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/userBack/getAllTeachers',
    params: {
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const loadAllTeachers = () => {
  return request({
    method: 'GET',
    url: '/userBack/loadAllTeachers'
  })
}

export const addTeacher = (teacherObj) => {
  return request({
    method: 'POST',
    url: '/userBack/addTeacher',
    data: teacherObj
  })
}

export const findTeacherByName = (realName, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/userBack/findTeacherByName',
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
    url: '/userBack/editTeacher',
    data: teacherObj
  })
}


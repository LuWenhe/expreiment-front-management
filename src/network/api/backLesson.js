import { request } from '@/network/request'

export const getAllLessons = () => {
  return request({
    method: 'GET',
    url: '/backLesson/getAllLessons'
  })
}
export const getLessonsByUserId = (pageRequest) => {
  return request({
    method: 'POST',
    url: '/backLesson/getLessonsByUserId',
    data: pageRequest
  })
}
export const getLessonsByTagName = (pageRequest) => {
  return request({
    method: 'POST',
    url: '/backLesson/getLessonsByTagName',
    data: pageRequest
  })
}
export const uploadFile = (formData) => {
  return request({
    method: 'POST',
    url: '/backLesson/uploadFile',
    data: formData
  })
}
export const addLesson = (lessonObj) => {
  return request({
    method: 'POST',
    url: '/backLesson/addLesson',
    data: lessonObj
  })
}
export const updateLesson = (lessonObj) => {
  return request({
    method: 'POST',
    url: '/backLesson/updateLessonInfo',
    data: lessonObj
  })
}
export const getLessonDetail = (lessonId) => {
  return request({
    method: 'GET',
    url: '/backLesson/getLessonDetail',
    params: {
      lessonId: lessonId
    }
  })
}
export const getChapterInfo = (lessonId) => {
  return request({
    method: 'GET',
    url: '/backLesson/getChapterInfoByLessonId',
    params: {
      lessonId: lessonId
    }
  })
}
export const uploadSingleFile = (formData) => {
  return request({
    method: 'POST',
    url: '/backLesson/addChapterJupyterURL',
    data: formData
  })
}
export const findLessonsByName = (pageRequest) => {
  return request({
    method: 'POST',
    url: '/backLesson/findLessonsByName',
    data: pageRequest
  })
}
export const addChapterInEdit = (chapterObj) => {
  return request({
    method: 'POST',
    url: '/backLesson/addChapterInEdit',
    data: chapterObj
  })
}
export const updateChapter = (chapterObj) => {
  return request({
    method: 'POST',
    url: '/backLesson/updateChapter',
    data: chapterObj
  })
}
export const delChapterInEdit = (chapterId) => {
  return request({
    method: 'GET',
    url: '/backLesson/delChapterInEdit',
    params: {
      chapterId: chapterId
    }
  })
}
export const delSonChapterInEdit = (sonId) => {
  return request({
    method: 'GET',
    url: '/backLesson/delSonChapterInEdit',
    params: {
      sonId: sonId
    }
  })
}
export const addSonChapterInEdit = (chapterObj) => {
  return request({
    method: 'POST',
    url: '/backLesson/addSonChapterInEdit',
    data: chapterObj
  })
}
export const editSonChapterInEdit = (chapterObj) => {
  return request({
    method: 'POST',
    url: '/backLesson/editSonChapterInEdit',
    data: chapterObj
  })
}
export const uploadAttachmentMp4 = (formData) => {
  return request({
    method: 'POST',
    url: '/backLesson/uploadAttachmentMp4',
    data: formData
  })
}
export const uploadAttachmentPPT = (formData) => {
  return request({
    method: 'POST',
    url: '/backLesson/uploadAttachmentPPT',
    data: formData
  })
}
export const uploadExcelImport = (formData) => {
  return request({
    method: 'POST',
    url: '/backLesson/uploadExcelImport',
    data: formData
  })
}
export const uploadExcelImportStu = (formData) => {
  return request({
    method: 'POST',
    url: '/backLesson/uploadExcelImportStu',
    data: formData
  })
}
export const addSonChapterBook = (sonChapterObj) => {
  return request({
    method: 'POST',
    url: '/backLesson/addSonChapterBook',
    data: sonChapterObj
  })
}
export const deleteLessonById = (lessonId) => {
  return request({
    method: 'GET',
    url: '/backLesson/deleteLessonById',
    params: {
      lessonId: lessonId
    }
  })
}
export const getEditSonChapterInfo = (sonId) => {
  return request({
    method: 'GET',
    url: '/backLesson/getEditSonChapterInfo',
    params: {
      sonId: sonId
    }
  })
}

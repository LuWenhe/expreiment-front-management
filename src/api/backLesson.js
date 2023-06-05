import { request } from '@/network/request'

export const getAllLessons = (pageRequest) => {
  return request({
    method: 'POST',
    url: '/lesson/getAllLessons',
    data: pageRequest
  })
}

export const addLessonPic = (formData) => {
  return request({
    method: 'POST',
    url: '/lesson/addLessonPic',
    data: formData
  })
}

export const addLesson = (lessonObj) => {
  return request({
    method: 'POST',
    url: '/lesson/addLesson',
    data: lessonObj
  })
}

export const updateLesson = (lessonObj) => {
  return request({
    method: 'POST',
    url: '/lesson/updateLessonInfo',
    data: lessonObj
  })
}

export const getLessonDetail = (lessonId) => {
  return request({
    method: 'GET',
    url: '/lesson/getLessonDetail',
    params: {
      lessonId: lessonId
    }
  })
}

export const getChapterInfo = (lessonId) => {
  return request({
    method: 'GET',
    url: '/lesson/getChapterInfoByLessonId',
    params: {
      lessonId: lessonId
    }
  })
}

export const uploadSingleFile = (formData) => {
  return request({
    method: 'POST',
    url: '/lesson/addChapterJupyterURL',
    data: formData
  })
}

export const findLessonsByName = (lessonName, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/lesson/findLessonsByName',
    params: {
      lessonName: lessonName,
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const addChapterInEdit = (chapterObj) => {
  return request({
    method: 'POST',
    url: '/lesson/addChapterInEdit',
    data: chapterObj
  })
}

export const delChapterInEdit = (chapterId) => {
  return request({
    method: 'GET',
    url: '/lesson/delChapterInEdit',
    params: {
      chapterId: chapterId
    }
  })
}

export const delSonChapterInEdit = (sonId) => {
  return request({
    method: 'GET',
    url: '/lesson/delSonChapterInEdit',
    params: {
      sonId: sonId
    }
  })
}

export const addSonChapterInEdit = (chapterObj) => {
  return request({
    method: 'POST',
    url: '/lesson/addSonChapterInEdit',
    data: chapterObj
  })
}

export const editSonChapterInEdit = (chapterObj) => {
  return request({
    method: 'POST',
    url: '/lesson/editSonChapterInEdit',
    data: chapterObj
  })
}

export const uploadAttachmentMp4 = (formData) => {
  return request({
    method: 'POST',
    url: '/lesson/uploadAttachmentMp4',
    data: formData
  })
}

export const uploadAttachmentPPT = (formData) => {
  return request({
    method: 'POST',
    url: '/lesson/uploadAttachmentPPT',
    data: formData
  })
}

export const uploadExcelImport = (formData) => {
  return request({
    method: 'POST',
    url: '/lesson/uploadExcelImport',
    data: formData
  })
}

export const uploadExcelImportStu = (formData) => {
  return request({
    method: 'POST',
    url: '/lesson/uploadExcelImportStu',
    data: formData
  })
}

export const loadTagList = (currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/lesson/loadTagList',
    params: {
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const addTag = (tagObj) => {
  return request({
    method: 'POST',
    url: '/lesson/addTag',
    data: tagObj
  })
}

export const editTag = (tagObj) => {
  return request({
    method: 'POST',
    url: '/lesson/editTag',
    data: tagObj
  })
}

export const deleteTag = (tagId) => {
  return request({
    method: 'GET',
    url: '/lesson/delTag',
    params: {
      tagId: tagId
    }
  })
}

export const getOptionList = () => {
  return request({
    method: 'GET',
    url: '/lesson/getOptionList',
  })
}

export const addSonChapterBook = (sonChapterObj) => {
  return request({
    method: 'POST',
    url: '/lesson/addSonChapterBook',
    data: sonChapterObj
  })
}

export const deleteLessonById = (lessonId) => {
  return request({
    method: 'GET',
    url: '/lesson/deleteLessonById',
    params: {
      lessonId: lessonId
    }
  })
}

export const getEditSonChapterInfo = (sonId) => {
  return request({
    method: 'GET',
    url: '/lesson/getEditSonChapterInfo',
    params: {
      sonId: sonId
    }
  })
}

export const getAllTools = (currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/lesson/getAllTools',
    params: {
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const findToolByName = (toolName, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/lesson/findToolByName',
    params: {
      toolName: currentPage,
      pageSize: pageSize
    }
  })
}

export const addTool = (toolObj) => {
  return request({
    method: 'POST',
    url: '/lesson/addTool',
    data: toolObj
  })
}

export const deleteTools = (toolIds) => {
  return request({
    method: 'POST',
    url: '/lesson/deleteTools',
    data: toolIds
  })
}

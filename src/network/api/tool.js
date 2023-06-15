import { request } from '@/network/request'

export const getAllTools = (currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/backTool/getAllTools',
    params: {
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export const findToolByName = (toolName, currentPage, pageSize) => {
  return request({
    method: 'GET',
    url: '/backTool/findToolByName',
    params: {
      toolName: currentPage,
      pageSize: pageSize
    }
  })
}

export const addTool = (toolObj) => {
  return request({
    method: 'POST',
    url: '/backTool/addTool',
    data: toolObj
  })
}

export const deleteTools = (toolIds) => {
  return request({
    method: 'POST',
    url: '/backTool/deleteTools',
    data: toolIds
  })
}

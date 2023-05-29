import axios from 'axios';

const $http = axios.create({});

export const get = (url, params) => {
  let paramsInput = {params: params} || {}
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    // axiso 自带 get 和 post 方法
    $http.get(url, paramsInput, {
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      }
    }).then(res => {
      resolve(res);
      // eslint-disable-next-line no-unused-vars
    }).catch(error => {
      alert('网络异常')
    })
  })
}

export const post = (url, params) => {
  params = params || {}
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    $http.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      }
    }).then(res => {
      // console.log(JSON.stringify(res))
      // if(res.data.status===0){
      //
      // }else{
      //     alert(res.data.msg);
      // }
      resolve(res)
      // eslint-disable-next-line no-unused-vars
    }).catch(error => {
      alert('网络异常')
    })
  })
}

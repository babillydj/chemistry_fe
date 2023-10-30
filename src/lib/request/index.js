import axios from 'axios'


const env = import.meta.env
let baseUrl = env.VITE_SERVER_URL

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const doRequest = async (config) => {
  let response = null

  try {
    response = await instance(config)
  } catch (error) {
    response = error.response
  }

  return response
}

export const errorMessage = {
  400: `Bad Request`,
  401: `You're Not Authorized`,
  403: `This action is forbidden`,
  404: `Not Found`,
  500: `Internal Server Error`,
  503: `No Internet Connection`
}


export default {
  doRequest,
  errorMessage
} 

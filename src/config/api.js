import axios from 'axios'

export const API_BASE_URL = axios.create({
  baseURL: 'http://localhost:8000/api'
})
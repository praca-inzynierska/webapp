import axios from 'axios'
import https from 'https'

export default axios.create({
  baseURL: 'https://localhost:8443/',
  responseType: 'json',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

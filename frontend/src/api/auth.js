import client from './client'

export async function registerUser(data) {
  const response = await client.post('/register', data)
  return response.data
}

export async function loginUser(data) {
  const response = await client.post('/login', data)
  return response.data
}
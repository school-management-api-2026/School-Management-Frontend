import axiosClient from '../axios'

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const res = await axiosClient.post('/upload', formData)

  return res.data.url
}
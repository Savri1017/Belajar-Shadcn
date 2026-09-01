import api from '@/config/api.js'

export const getPenggunaMedia = (penggunaId) =>
  api.get(`/media/pengguna/${penggunaId}`)

export const uploadPenggunaMedia = (penggunaId, file, collection = 'default', altText = '') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('collection', collection)
  if (altText) formData.append('alt_text', altText)

  return api.post(`/media/pengguna/${penggunaId}`, formData)
}

export const deleteMedia = (mediaId) =>
  api.delete(`/media/${mediaId}`)

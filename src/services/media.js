import api from '@/config/api.js'

export const getMedia = (modelType, modelId) =>
  api.get(`/media/${modelType}/${modelId}`)

export const uploadMedia = (modelType, modelId, file, collection = 'default', altText = '') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('collection', collection)
  if (altText) formData.append('alt_text', altText)

  return api.post(`/media/${modelType}/${modelId}`, formData)
}

export const deleteMedia = (mediaId) =>
  api.delete(`/media/${mediaId}`)

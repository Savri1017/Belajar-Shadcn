import api from '@/config/api.js'

export async function getMedia(modelType, modelId, collection = null) {
  const response = await api.get(`/media/${modelType}/${modelId}`, {
    params: collection ? { collection } : {},
  })

  return response.data
}

export async function uploadMedia(modelType, modelId, file, options = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('collection', options.collection || 'default')
  formData.append('replace', options.replace ? '1' : '0')

  if (options.altText) {
    formData.append('alt_text', options.altText)
  }

  const response = await api.post(`/media/${modelType}/${modelId}`, formData)
  return response.data
}

export async function deleteMedia(mediaId) {
  const response = await api.delete(`/media/${mediaId}`)
  return response.data
}

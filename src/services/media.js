import api from '@/config/api.js'

// collection opsional: kalau diisi ('avatar', 'dokumen', dst), backend cuma
// balikin baris tabel media yang collection-nya cocok. Kalau dikosongin,
// semua media milik model tetap kebalikin (perilaku lama tetap jalan).
export const getMedia = (modelType, modelId, collection = null) =>
  api.get(`/media/${modelType}/${modelId}`, {
    params: collection ? { collection } : {},
  })

export const uploadMedia = (modelType, modelId, file, collection = 'default', altText = '') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('collection', collection)
  if (altText) formData.append('alt_text', altText)

  return api.post(`/media/${modelType}/${modelId}`, formData)
}

export const deleteMedia = (mediaId) =>
  api.delete(`/media/${mediaId}`)

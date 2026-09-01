```js
import api from '@/config/api.js'

// collection opsional.
// Kalau diisi ('avatar', 'dokumen', dst), backend hanya
// mengembalikan media dengan collection tersebut.
// Kalau dikosongkan, semua media milik model dikembalikan.
export const getMedia = (modelType, modelId, collection = null) =>
  api.get(`/media/${modelType}/${modelId}`, {
    params: collection ? { collection } : {},
  })

export const uploadMedia = (
  modelType,
  modelId,
  file,
  collection = 'default',
  altText = ''
) => {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('collection', collection)

  if (altText) {
    formData.append('alt_text', altText)
  }

  return api.post(`/media/${modelType}/${modelId}`, formData)
}

export const deleteMedia = (mediaId) =>
  api.delete(`/media/${mediaId}`)
```

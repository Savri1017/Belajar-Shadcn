import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

function notify(type, title, message) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent('api-notification', {
      detail: { type, title, message },
    }),
  )
}

function getErrorMessage(error) {
  const response = error.response
  const validationErrors = response?.data?.errors

  if (validationErrors) {
    const firstError = Object.values(validationErrors).flat()[0]
    if (firstError) return firstError
  }

  return (
    response?.data?.message ||
    error.message ||
    'Terjadi kesalahan. Silakan coba lagi.'
  )
}

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase()

    const messages = {
      post: ['Berhasil', 'Data berhasil ditambahkan.'],
      put: ['Berhasil', 'Data berhasil diperbarui.'],
      patch: ['Berhasil', 'Data berhasil diperbarui.'],
      delete: ['Berhasil', 'Data berhasil dihapus.'],
    }

    if (messages[method]) {
      const [title, message] = messages[method]
      notify('success', title, message)
    }

    return response
  },
  (error) => {
    const status = error.response?.status

    if (status === 422) {
      notify('error', 'Data tidak valid', getErrorMessage(error))
    } else if (status === 404) {
      notify('error', 'Tidak ditemukan', 'Data atau endpoint yang diminta tidak ditemukan.')
    } else if (status === 500) {
      notify('error', 'Server error', 'Terjadi masalah pada server Laravel.')
    } else if (!error.response) {
      notify('error', 'Koneksi gagal', 'Tidak dapat terhubung ke server Laravel.')
    } else {
      notify('error', 'Terjadi kesalahan', getErrorMessage(error))
    }

    return Promise.reject(error)
  },
)

export default api

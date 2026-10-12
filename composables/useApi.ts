import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const fetchWithAuth = <T>(
    request: NitroFetchRequest,
    options: NitroFetchOptions<NitroFetchRequest> = {}
  ): Promise<T> => {
    const headers = new Headers(options.headers || {})

    if (authStore.token) {
      headers.set('Authorization', `Bearer ${authStore.token}`)
    }

    const requestFetch = $fetch as unknown as (
      url: string,
      fetchOptions: NitroFetchOptions<NitroFetchRequest>
    ) => Promise<T>

    return requestFetch(String(request), {
      baseURL: config.public.apiBase,
      ...options,
      headers
    })
  }

  return {
    get: <T>(url: NitroFetchRequest, options?: NitroFetchOptions<NitroFetchRequest>) =>
      fetchWithAuth<T>(url, { method: 'GET', ...options }),
    post: <T>(url: NitroFetchRequest, body?: any, options?: NitroFetchOptions<NitroFetchRequest>) =>
      fetchWithAuth<T>(url, { method: 'POST', body, ...options }),
    put: <T>(url: NitroFetchRequest, body?: any, options?: NitroFetchOptions<NitroFetchRequest>) =>
      fetchWithAuth<T>(url, { method: 'PUT', body, ...options }),
    delete: <T>(url: NitroFetchRequest, options?: NitroFetchOptions<NitroFetchRequest>) =>
      fetchWithAuth<T>(url, { method: 'DELETE', ...options })
  }
}

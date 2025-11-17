/**
 * ===================================================================
 * HELPERS PARA CHAMADAS DE API
 * ===================================================================
 *
 * Funções utilitárias para simplificar chamadas HTTP ao backend.
 * Padroniza tratamento de erros e reduz código duplicado.
 *
 * @module utils/api.helpers
 */

import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * ===================================================================
 * CONFIGURAÇÃO BASE
 * ===================================================================
 */

/**
 * URL base da API.
 * Em desenvolvimento: http://localhost:3001/api
 * Em produção (Electron): http://localhost:3001/api
 */
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

/**
 * ===================================================================
 * TIPOS E INTERFACES
 * ===================================================================
 */

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

/**
 * Configurações opcionais para requisições
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  onUploadProgress?: (progressEvent: any) => void;
}

/**
 * ===================================================================
 * FUNÇÕES DE REQUISIÇÃO HTTP
 * ===================================================================
 */

/**
 * Realiza requisição GET
 *
 * @param endpoint - Endpoint da API (sem /api no início)
 * @param options - Opções adicionais
 * @returns Promessa com os dados da resposta
 *
 * @example
 * const spaces = await apiGet('/spaces');
 * const space = await apiGet(`/spaces/${id}`);
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('📡 GET:', url);

    const response: AxiosResponse<T> = await axios.get(url, {
      headers: options.headers,
      timeout: options.timeout || 30000,
    });

    console.log('✅ GET Response:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, 'GET', endpoint);
    throw error;
  }
}

/**
 * Realiza requisição POST
 *
 * @param endpoint - Endpoint da API
 * @param data - Dados a enviar
 * @param options - Opções adicionais
 * @returns Promessa com os dados da resposta
 *
 * @example
 * const newSpace = await apiPost('/spaces', { name: 'Medicina', color: '#3b82f6' });
 */
export async function apiPost<T = any>(
  endpoint: string,
  data: any = {},
  options: RequestOptions = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('📡 POST:', url, data);

    const response: AxiosResponse<T> = await axios.post(url, data, {
      headers: options.headers,
      timeout: options.timeout || 30000,
      onUploadProgress: options.onUploadProgress,
    });

    console.log('✅ POST Response:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, 'POST', endpoint);
    throw error;
  }
}

/**
 * Realiza requisição PUT
 *
 * @param endpoint - Endpoint da API
 * @param data - Dados a atualizar
 * @param options - Opções adicionais
 * @returns Promessa com os dados da resposta
 *
 * @example
 * const updated = await apiPut(`/spaces/${id}`, { name: 'Medicina Atualizada' });
 */
export async function apiPut<T = any>(
  endpoint: string,
  data: any = {},
  options: RequestOptions = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('📡 PUT:', url, data);

    const response: AxiosResponse<T> = await axios.put(url, data, {
      headers: options.headers,
      timeout: options.timeout || 30000,
    });

    console.log('✅ PUT Response:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, 'PUT', endpoint);
    throw error;
  }
}

/**
 * Realiza requisição DELETE
 *
 * @param endpoint - Endpoint da API
 * @param options - Opções adicionais
 * @returns Promessa com os dados da resposta
 *
 * @example
 * await apiDelete(`/spaces/${id}`);
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('📡 DELETE:', url);

    const response: AxiosResponse<T> = await axios.delete(url, {
      headers: options.headers,
      timeout: options.timeout || 30000,
    });

    console.log('✅ DELETE Response:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, 'DELETE', endpoint);
    throw error;
  }
}

/**
 * ===================================================================
 * UPLOAD DE ARQUIVOS
 * ===================================================================
 */

/**
 * Realiza upload de arquivo
 *
 * @param endpoint - Endpoint da API
 * @param file - Arquivo a enviar
 * @param additionalData - Dados adicionais do formulário
 * @param onProgress - Callback para progresso do upload
 * @returns Promessa com os dados da resposta
 *
 * @example
 * const result = await uploadFile('/sources/pdf', pdfFile, { note_id: 1 }, (progress) => {
 *   console.log(`Upload: ${progress}%`);
 * });
 */
export async function uploadFile<T = any>(
  endpoint: string,
  file: File,
  additionalData: Record<string, any> = {},
  onProgress?: (progress: number) => void
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  // Adiciona dados extras ao FormData
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return apiPost<T>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
}

/**
 * ===================================================================
 * TRATAMENTO DE ERROS
 * ===================================================================
 */

/**
 * Trata erros de API de forma padronizada
 *
 * @param error - Erro do Axios
 * @param method - Método HTTP
 * @param endpoint - Endpoint que falhou
 */
function handleApiError(error: AxiosError, method: string, endpoint: string): void {
  console.error(`❌ ${method} ${endpoint} falhou:`, error);

  if (error.response) {
    // Servidor respondeu com erro (4xx, 5xx)
    const status = error.response.status;
    const data: any = error.response.data;

    console.error(`Status: ${status}`);
    console.error(`Mensagem: ${data?.error || data?.message || 'Erro desconhecido'}`);

    // Log específico por tipo de erro
    if (status === 404) {
      console.error('❌ Recurso não encontrado');
    } else if (status === 400) {
      console.error('❌ Requisição inválida');
    } else if (status === 401) {
      console.error('❌ Não autorizado');
    } else if (status === 403) {
      console.error('❌ Acesso negado');
    } else if (status >= 500) {
      console.error('❌ Erro no servidor');
    }
  } else if (error.request) {
    // Requisição foi feita mas não houve resposta
    console.error('❌ Sem resposta do servidor. Verifique se o backend está rodando.');
  } else {
    // Erro na configuração da requisição
    console.error('❌ Erro ao configurar requisição:', error.message);
  }
}

/**
 * ===================================================================
 * HELPERS DE VALIDAÇÃO
 * ===================================================================
 */

/**
 * Verifica se o backend está acessível
 *
 * @returns true se backend está online, false caso contrário
 *
 * @example
 * if (await isBackendOnline()) {
 *   // Carregar dados
 * } else {
 *   // Mostrar mensagem de erro
 * }
 */
export async function isBackendOnline(): Promise<boolean> {
  try {
    await apiGet('/health');
    return true;
  } catch {
    return false;
  }
}

/**
 * Aguarda backend estar pronto (útil no startup do Electron)
 *
 * @param maxAttempts - Número máximo de tentativas (padrão: 10)
 * @param delayMs - Delay entre tentativas em ms (padrão: 1000)
 * @returns true se backend ficou online, false se timeout
 *
 * @example
 * const ready = await waitForBackend();
 * if (ready) {
 *   console.log('Backend pronto!');
 * }
 */
export async function waitForBackend(
  maxAttempts: number = 10,
  delayMs: number = 1000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`⏳ Aguardando backend... tentativa ${i + 1}/${maxAttempts}`);

    if (await isBackendOnline()) {
      console.log('✅ Backend online!');
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  console.error('❌ Timeout aguardando backend');
  return false;
}

/**
 * ===================================================================
 * HELPERS ESPECÍFICOS DO DOMÍNIO
 * ===================================================================
 */

/**
 * Cria funções CRUD para uma entidade
 *
 * @param entityName - Nome da entidade (ex: 'spaces', 'notes')
 * @returns Objeto com funções CRUD
 *
 * @example
 * const spacesApi = createCrudApi('spaces');
 * const spaces = await spacesApi.getAll();
 * const space = await spacesApi.getById(1);
 * const newSpace = await spacesApi.create({ name: 'Medicina' });
 * await spacesApi.update(1, { name: 'Medicina Atualizada' });
 * await spacesApi.delete(1);
 */
export function createCrudApi<T = any>(entityName: string) {
  const endpoint = `/${entityName}`;

  return {
    /**
     * Lista todos os registros
     */
    getAll: (): Promise<{ data: T[] }> =>
      apiGet(`${endpoint}`),

    /**
     * Busca um registro por ID
     */
    getById: (id: number): Promise<{ data: T }> =>
      apiGet(`${endpoint}/${id}`),

    /**
     * Cria novo registro
     */
    create: (data: Partial<T>): Promise<{ data: T }> =>
      apiPost(endpoint, data),

    /**
     * Atualiza registro existente
     */
    update: (id: number, data: Partial<T>): Promise<{ data: T }> =>
      apiPut(`${endpoint}/${id}`, data),

    /**
     * Deleta registro
     */
    delete: (id: number): Promise<{ data: { success: boolean } }> =>
      apiDelete(`${endpoint}/${id}`),
  };
}

/**
 * ===================================================================
 * EXPORTAÇÕES
 * ===================================================================
 */

export default {
  // HTTP Methods
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,

  // File Upload
  uploadFile,

  // Validation
  isBackendOnline,
  waitForBackend,

  // CRUD Helper
  createCrudApi,

  // Base URL
  baseUrl: API_BASE_URL,
};

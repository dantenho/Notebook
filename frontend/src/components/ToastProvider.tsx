/**
 * ===================================================================
 * SISTEMA DE NOTIFICAÇÕES TOAST
 * ===================================================================
 *
 * Componente de notificações toast para feedback visual ao usuário.
 * Usa react-hot-toast para exibir mensagens de sucesso, erro, loading.
 *
 * @module components/Toast
 */

import { Toaster } from 'react-hot-toast';

/**
 * Componente Toaster global
 * Deve ser incluído uma vez no App.tsx
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Estilos padrão
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        // Estilos por tipo
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}

/**
 * Funções helper para exibir toasts
 * Importar como: import { showSuccess, showError, ... } from './utils/toast';
 */

import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, messages);
};

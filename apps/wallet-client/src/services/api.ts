import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Configuración de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Error de respuesta del servidor
      return Promise.resolve(error.response);
    } else if (error.request) {
      // Error de red - no se recibió respuesta
      return Promise.resolve({
        data: {
          success: false,
          message: "Error de conexión. Verifica tu internet.",
          code: "NETWORK_ERROR",
        },
      });
    } else {
      // Error al configurar la petición
      return Promise.resolve({
        data: {
          success: false,
          message: "Error inesperado. Intenta nuevamente.",
          code: "UNKNOWN_ERROR",
        },
      });
    }
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
}

export const api = {
  async registerClient(data: {
    documento: string;
    nombres: string;
    email: string;
    celular: string;
  }): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post("/clients/register", data);
      return response.data;
    } catch (error) {
      console.error("Error en registerClient:", error);
      return {
        success: false,
        message: "Error al registrar cliente",
        code: "REGISTER_ERROR",
      };
    }
  },

  async rechargeWallet(data: {
    documento: string;
    celular: string;
    valor: number;
  }): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post("/clients/recharge", data);
      return response.data;
    } catch (error) {
      console.error("Error en rechargeWallet:", error);
      return {
        success: false,
        message: "Error al recargar billetera",
        code: "RECHARGE_ERROR",
      };
    }
  },

  async initiatePayment(data: {
    documento: string;
    celular: string;
    valor: number;
  }): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        "/clients/payment/initiate",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error en initiatePayment:", error);
      return {
        success: false,
        message: "Error al iniciar pago",
        code: "PAYMENT_INITIATE_ERROR",
      };
    }
  },

  async confirmPayment(data: {
    sessionId: string;
    token: string;
  }): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        "/clients/payment/confirm",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error en confirmPayment:", error);
      return {
        success: false,
        message: "Error al confirmar pago",
        code: "PAYMENT_CONFIRM_ERROR",
      };
    }
  },

  async checkBalance(data: {
    documento: string;
    celular: string;
  }): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post("/clients/balance", data);
      return response.data;
    } catch (error) {
      console.error("Error en checkBalance:", error);
      return {
        success: false,
        message: "Error al consultar saldo",
        code: "BALANCE_ERROR",
      };
    }
  },
};

export default api;

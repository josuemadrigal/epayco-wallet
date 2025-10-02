const API_URL = import.meta.env.VITE_API_URL;

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
    const response = await fetch(`${API_URL}/clients/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async rechargeWallet(data: {
    documento: string;
    celular: string;
    valor: number;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/clients/recharge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async initiatePayment(data: {
    documento: string;
    celular: string;
    valor: number;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/clients/payment/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async confirmPayment(data: {
    sessionId: string;
    token: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/clients/payment/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async checkBalance(data: {
    documento: string;
    celular: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/clients/balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

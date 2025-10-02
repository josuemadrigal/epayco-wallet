import { useState } from "react";
import { api } from "../services/api";

export default function BalanceForm() {
  const [formData, setFormData] = useState({
    documento: "",
    celular: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    data?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.checkBalance(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text: response.message,
          data: response.data,
        });
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al conectar con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Consultar Saldo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento *
          </label>
          <input
            type="text"
            required
            value={formData.documento}
            onChange={(e) =>
              setFormData({ ...formData, documento: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ej: 1234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Celular *
          </label>
          <input
            type="tel"
            required
            value={formData.celular}
            onChange={(e) =>
              setFormData({ ...formData, celular: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ej: 3001234567"
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" && message.data ? (
              <div className="text-center">
                <p className="text-gray-600 mb-2">Titular</p>
                <p className="text-xl font-bold text-gray-800 mb-4">
                  {message.data.nombres}
                </p>
                <p className="text-gray-600 mb-2">Saldo Disponible</p>
                <p className="text-4xl font-bold text-green-600">
                  ${Number(message.data.saldo).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="font-medium">{message.text}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Consultando..." : "Consultar Saldo"}
        </button>
      </form>
    </div>
  );
}

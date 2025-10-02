import { useState } from "react";
import { api } from "../services/api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    documento: "",
    nombres: "",
    email: "",
    celular: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.registerClient(formData);

      if (response.success) {
        setMessage({ type: "success", text: response.message });
        setFormData({ documento: "", nombres: "", email: "", celular: "" });
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error al conectar con el servidor: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registrar Cliente
      </h2>

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
            Nombres Completos *
          </label>
          <input
            type="text"
            required
            value={formData.nombres}
            onChange={(e) =>
              setFormData({ ...formData, nombres: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ej: juan@email.com"
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
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Registrando..." : "Registrar Cliente"}
        </button>
      </form>
    </div>
  );
}

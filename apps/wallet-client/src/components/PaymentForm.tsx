import { useState } from "react";
import { api } from "../services/api";

export default function PaymentForm() {
  const [step, setStep] = useState<"initiate" | "confirm">("initiate");
  const [initiateData, setInitiateData] = useState({
    documento: "",
    celular: "",
    valor: "",
  });
  const [confirmData, setConfirmData] = useState({
    sessionId: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    data?: any;
  } | null>(null);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.initiatePayment({
        documento: initiateData.documento,
        celular: initiateData.celular,
        valor: parseFloat(initiateData.valor),
      });

      if (response.success) {
        setMessage({
          type: "success",
          text: response.message,
          data: response.data,
        });
        setConfirmData({ ...confirmData, sessionId: response.data.sessionId });
        setStep("confirm");
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al conectar con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.confirmPayment(confirmData);

      if (response.success) {
        setMessage({
          type: "success",
          text: response.message,
          data: response.data,
        });
        // Reset después de 3 segundos
        setTimeout(() => {
          setStep("initiate");
          setInitiateData({ documento: "", celular: "", valor: "" });
          setConfirmData({ sessionId: "", token: "" });
          setMessage(null);
        }, 3000);
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Realizar Pago</h2>

      {step === "initiate" ? (
        <form onSubmit={handleInitiate} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              📧 Recibirás un token de 6 dígitos en tu email para confirmar el
              pago
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento *
            </label>
            <input
              type="text"
              required
              value={initiateData.documento}
              onChange={(e) =>
                setInitiateData({ ...initiateData, documento: e.target.value })
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
              value={initiateData.celular}
              onChange={(e) =>
                setInitiateData({ ...initiateData, celular: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ej: 3001234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor a Pagar *
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={initiateData.valor}
              onChange={(e) =>
                setInitiateData({ ...initiateData, valor: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ej: 25000"
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
              <p className="font-medium">{message.text}</p>
              {message.data?.email && (
                <p className="mt-2 text-sm">
                  Revisa tu email: {message.data.email}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Procesando..." : "Iniciar Pago"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              🔒 Ingresa el token de 6 dígitos que recibiste en tu email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session ID
            </label>
            <input
              type="text"
              disabled
              value={confirmData.sessionId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token de Confirmación *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={confirmData.token}
              onChange={(e) =>
                setConfirmData({ ...confirmData, token: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
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
              <p className="font-medium">{message.text}</p>
              {message.data?.nuevoSaldo && (
                <p className="mt-2">
                  Nuevo saldo: $
                  {Number(message.data.nuevoSaldo).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("initiate");
                setMessage(null);
                setConfirmData({ sessionId: "", token: "" });
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Confirmando..." : "Confirmar Pago"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

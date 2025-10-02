import { useState } from "react";
import {
  Wallet,
  CreditCard,
  UserPlus,
  Send,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import RegisterForm from "../components/RegisterForm";
import RechargeForm from "../components/RechargeForm";
import PaymentForm from "../components/PaymentForm";
import BalanceForm from "../components/BalanceForm";

type ViewType = "home" | "register" | "recharge" | "payment" | "balance";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "register" as const,
      label: "Registrar Cliente",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "recharge" as const,
      label: "Recargar",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      id: "payment" as const,
      label: "Realizar Pago",
      icon: Send,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "balance" as const,
      label: "Consultar Saldo",
      icon: Wallet,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const handleNavigation = (view: ViewType) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case "register":
        return <RegisterForm />;
      case "recharge":
        return <RechargeForm />;
      case "payment":
        return <PaymentForm />;
      case "balance":
        return <BalanceForm />;
      default:
        return (
          <HomeContent onNavigate={handleNavigation} menuItems={menuItems} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation("home")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ecoWallet
                </h1>
                <p className="text-xs text-gray-500">Prueba técnica</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeView === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {activeView !== "home" && (
            <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
              <button
                onClick={() => handleNavigation("home")}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Volver al inicio</span>
              </button>
            </div>
          )}
          <div className="p-6 lg:p-8">{renderContent()}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>
            © 2025 ecoWallet. Prueba técnica billetera virtual por Josué
            Madrigal.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Home Content Component
interface HomeContentProps {
  onNavigate: (view: ViewType) => void;
  menuItems: Array<{
    id: ViewType;
    label: string;
    icon: any;
    color: string;
  }>;
}

function HomeContent({ onNavigate, menuItems }: HomeContentProps) {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-6">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ecoWallet
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gestiona tu billetera virtual de forma fácil y segura. Realiza pagos,
          recargas y consulta tu saldo en segundos.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 text-left"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
            >
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.label}
            </h3>
            <p className="text-sm text-gray-500">
              {index === 0 && "Registra nuevos clientes en el sistema"}
              {index === 1 && "Añade saldo a tu billetera virtual"}
              {index === 2 && "Realiza pagos de forma segura"}
              {index === 3 && "Verifica tu saldo disponible"}
            </p>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          ¿Cómo funciona?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Regístrate</h4>
              <p className="text-sm text-gray-600">
                Crea tu cuenta con tus datos personales
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Recarga</h4>
              <p className="text-sm text-gray-600">
                Añade saldo a tu billetera virtual
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Paga</h4>
              <p className="text-sm text-gray-600">
                Realiza pagos seguros con confirmación
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

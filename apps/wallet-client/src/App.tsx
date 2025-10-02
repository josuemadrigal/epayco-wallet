import React, { Suspense } from "react";
import RoutesComponent from "./Router/Router";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="relative flex justify-center items-center w-screen h-screen gap-5">
            <div className="flex justify-center items-center">
              <div className="absolute animate-spin rounded-md h-16 w-16 border-4  border-emerald-500"></div>
            </div>
            <span className="text-2xl text-emerald-500">Cargando...</span>
          </div>
        }
      >
        <RoutesComponent />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

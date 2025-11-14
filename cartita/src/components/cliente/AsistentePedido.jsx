'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Step1DatosPersonales from './steps/Step1DatosPersonales';
import Step2MetodoEntrega from './steps/Step2MetodoEntrega';
import Step3Menu from './steps/Step3Menu';
import Step4MetodoPago from './steps/Step4MetodoPago';

const STEPS = [
  { id: 1, title: 'Tus datos', component: Step1DatosPersonales },
  { id: 2, title: 'Entrega', component: Step2MetodoEntrega },
  { id: 3, title: 'Menú', component: Step3Menu },
  { id: 4, title: 'Pago', component: Step4MetodoPago }
];

export default function AsistentePedido({ local, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [pedidoData, setPedidoData] = useState({
    // Step 1
    nombreCliente: '',
    telefonoCliente: '',
    
    // Step 2
    tipoEntrega: null, // 'takeaway' | 'envio'
    direccion: '',
    latitud: null,
    longitud: null,
    referenciaDireccion: '',
    
    // Step 3 - se maneja con el carrito
    
    // Step 4
    metodoPago: null, // 'efectivo' | 'transferencia' | 'mercadopago'
    comprobanteBase64: null
  });

  const updatePedidoData = (data) => {
    setPedidoData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Steps Indicator */}
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-black text-white ring-4 ring-black/10'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? <Check size={20} /> : step.id}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium hidden sm:block ${
                      currentStep === step.id ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <CurrentStepComponent
            local={local}
            pedidoData={pedidoData}
            updatePedidoData={updatePedidoData}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            onComplete={onComplete}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === STEPS.length}
          />
        </div>
      </div>

      {/* Navigation Buttons - Mobile Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-30">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={goToPrevStep}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            >
              <ChevronLeft size={20} />
              Atrás
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

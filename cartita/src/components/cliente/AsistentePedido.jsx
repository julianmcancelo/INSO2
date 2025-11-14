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
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          {/* Steps Indicator */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-black text-white ring-2 md:ring-4 ring-black/10'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? <Check size={16} className="md:w-5 md:h-5" /> : step.id}
                  </div>
                  <span
                    className={`text-[10px] md:text-xs mt-1 font-medium hidden sm:block ${
                      currentStep === step.id ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 md:h-1 flex-1 mx-1 md:mx-2 rounded-full transition-all ${
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
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8 pb-24 md:pb-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
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

      {/* Mobile Bottom Padding */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}

import React from 'react';

const ProductoSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      
      {/* Contenido skeleton */}
      <div className="p-4 space-y-3">
        {/* Título */}
        <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
        
        {/* Descripción */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Precio y botón */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 bg-gray-200 rounded-lg w-20"></div>
          <div className="h-9 w-28 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductoSkeleton;

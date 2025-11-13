const ProductoSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductoSkeleton;

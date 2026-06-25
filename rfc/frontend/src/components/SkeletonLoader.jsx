function SkeletonLoader() {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl p-5 h-80 w-full">
      <div className="bg-gray-300 dark:bg-gray-700 h-40 rounded-xl mb-4"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
    </div>
  );
}
export default SkeletonLoader;

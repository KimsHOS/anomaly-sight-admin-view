
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'MISMATCHED':
      return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
    case 'NO_ENROLLEMENT_FOUND':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    case 'MATCHED':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  }
};

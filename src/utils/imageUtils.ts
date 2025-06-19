
export const getValidBase64 = (base64: string, employee_id: string): string => {
  if (!base64) {
    console.warn(`No base64 data for login image, employee_id: ${employee_id}`);
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
  if (!base64.startsWith('data:image/')) {
    return `data:image/png;base64,${base64}`;
  }
  return base64;
};

export const getEnrollImageUrl = (state: string, employee_id: string): string => {
  return `http://eams.achalasolutions.com:8091/attendance/document/fetchFileFromCloud?fileName=EMPLOYEEIMAGES/${state}/${employee_id}.png`;
};

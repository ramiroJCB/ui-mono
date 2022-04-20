export const getMimeType = (file: File) => {
  const fileExtension = file.name.split('.').slice(-1)[0];

  switch (fileExtension) {
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default:
      return 'application/octet-stream';
  }
};

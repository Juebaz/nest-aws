export const getDatabaseConnectionString = () => {
  const DB_NAME = 'ugramV2';
  
  return `mongodb+srv://ugram:instagram@cluster0.biqab.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
};

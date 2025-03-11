// Ensure that the MONGO_URI is provided
export const mongoUri = process.env.MONGO_URI;
export const mongoUrlQueryParams = process.env.MONGO_URL_QUERY_PARAMS;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not set");
}

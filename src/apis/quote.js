import axios from "axios";

const quoteApi = axios.create({
  baseURL: "https://dummyjson.com",
});

const getRandomInspirationalQuote = async () => {
  const response = await quoteApi.get("/quotes/random");
  return response.data;
};

export { getRandomInspirationalQuote };

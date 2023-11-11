import axios from "axios"

const quoteApi = axios.create({
    baseURL: "https://api.quotable.io",
})

const getRandomInspirationalQuote = async () => {
    const response = await quoteApi.get("/random?tags=inspirational")
    return response.data
}

export { getRandomInspirationalQuote }
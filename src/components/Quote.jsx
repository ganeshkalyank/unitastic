import { useEffect, useState } from 'react'
import './Quote.css'

const Quote = () => {
    const [quote, setQuote] = useState({})

    const fetchQuote = async () => {
        const response = await fetch("https://api.quotable.io/random?tags=inspirational")
        const data = await response.json()
        setQuote(data)
    }

    useEffect(() => {
        fetchQuote()
    }, [])

    return (
        <div className="bg-white p-3 p-lg-5">
            <div className="container quote-container">
                <h3 className="text-center mb-3">Random Thought</h3>
                <figure className="text-center">
                    <blockquote className="blockquote">
                        <p>{quote.content}</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        <cite title="Source Title">{quote.author}</cite>
                    </figcaption>
                </figure>
            </div>
        </div>
    );
}

export default Quote
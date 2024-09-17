import { useEffect, useState } from "react";
import { getRandomInspirationalQuote } from "../../apis/quote";
import "./Quote.css";
import { QUOTES } from "../../utils/constants";

const Quote = () => {
  const [quote, setQuote] = useState(
    QUOTES[Math.floor(Math.random() * QUOTES.length)],
  );

  useEffect(() => {
    getRandomInspirationalQuote().then((quote) => setQuote(quote));
  }, []);

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
};

export default Quote;

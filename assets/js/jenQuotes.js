const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
document.querySelector('.quotes').textContent = randomQuote.quote;
document.querySelector('.quote-author').textContent = randomQuote.writer;

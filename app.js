const Request = require("request");

// Start of markdown
const textToConvert = `Heading
=======
## Sub-heading

Paragraphs are separated
by a blank line.

Two spaces at the end of a line  
produces a line break.

Text attributes _italic_, 
**bold**, 'monospace'.
A [link](http://example.com).
Horizontal rule:`;

// End of markdown

Request.post(
  {
    headers: { "content-type": "application/json" },
    url: "http://localhost:3000/convert",
    body: JSON.stringify({
      content: textToConvert,
      username: "user",
      password: "pass",
    }),
  },
  function (error, response, body) {
    // Если мы получили ошибку соединения, показать ее.
    if (error) {
      return console.log(error);
    }
    // иначе отображаем преобразованный текст
    console.dir(JSON.parse(body));
  }
);

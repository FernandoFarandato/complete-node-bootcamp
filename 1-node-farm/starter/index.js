/** @format */

//Core Modules
const fs = require('fs');
const http = require('http');
const url = require('url');

//Own modules
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////////////////////

// READING - WRITING FILES

// BLOCKING, synchronous way
/*
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
*/
// NON-BLOCKING, asynchronous way
/*
 fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
   if (err) return console.log('ERROR! 💥');

   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
     console.log(data2);
     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
       console.log(data3)
       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
         console.log('Your file has been written 😁');
       })
     });
   });
 });
 console.log('Will read file!');
*/
////////////////////////////////////////////////
//SERVER

const tempOverview = fs.readFileSync(
  './templates/template-overview.html',
  'utf8'
);
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf8');
const tempProduct = fs.readFileSync(
  './templates/template-product.html',
  'utf8'
);

const data = fs.readFileSync('./dev-data/data.json', 'utf8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const cardsHtml = dataObject
      .map((element) => replaceTemplate(tempCard, element))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    //console.log(cardsHtml);
    res.end(output);
  }
  //Product
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }
  //Api
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  }
  //Not Found
  else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end(`<h1>Page not Found <h/1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000...');
});

/** @format */

const fs = require('fs');
const http = require('http');
const url = require('url');

//////////////////////////////////////////////////

// FILES

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

const data = fs.readFileSync('./dev-data/data.json', 'utf8');
const tempOverview = fs.readFileSync(
  './templates/template-overview.html',
  'utf8'
);
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf8');
const tempProduct = fs.readFileSync(
  './templates/template-product.html',
  'utf8'
);

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathname = req.url;

  //Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(tempOverview);
  }
  //Product
  else if (pathname === '/product') {
    res.end('This is the Product');
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

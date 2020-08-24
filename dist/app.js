const express = require('express');

const request = require('request');

const fs = require('fs');

const cors = require('cors');

const jsdom = require("jsdom");

const path = require('path');

var compression = require('compression');

var helmet = require('helmet');

const {
  JSDOM
} = jsdom;
const app = express();
const port = 3000;
const URLTIEMPO = 'http://consultasqrou.avanzagrupo.com:8088/default.aspx?parada=';
const URLPARADAS = 'http://www.urbanosdeourense.es/php/index.php?pag=lineas/smbus';
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.static(__dirname + '/public'));
app.get('/api/stops/:id', (req, res) => {
  const page = req.query.page;

  if (page && page != 1) {
    var options = {
      'method': 'POST',
      'url': URLTIEMPO + req.params.id,
      'headers': {},
      formData: {
        '__EVENTARGUMENT': 'Page$' + page,
        '__EVENTVALIDATION': '/wEdAAKq/IWPLbRqtTE0X2CVJzl1PW0eVPbW6XQJ+DccWuRIVOMWnUK6sWHz6mm5L+nfWn0X06QhwqDscc8PMBqOYJ14',
        '__VIEWSTATE': '/wEPDwUKMTQwNDcyMjQ4Mw9kFgICAw9kFgoCAQ8PFgIeBFRleHQFAjIwZGQCAw8PFgIfAAULSG9yYTogMjE6MTNkZAIFDw8WAh8ABQxYQVJESU4gUE9TSU9kZAIHDzwrABEDAA8WBB4LXyFEYXRhQm91bmRnHgtfIUl0ZW1Db3VudAIHZAEQFgAWABYADBQrAAAWAmYPZBYMAgEPZBYGZg8PFgIfAAUCMTBkZAIBDw8WAh8ABQ5DQUJFWkEgREUgVkFDQWRkAgIPDxYCHwAFATBkZAICD2QWBmYPDxYCHwAFAjEyZGQCAQ8PFgIfAAURUEFaTyBET1MgREVQT1JURVNkZAICDw8WAh8ABQExZGQCAw9kFgZmDw8WAh8ABQI2QmRkAgEPDxYCHwAFClJFU0lERU5DSUFkZAICDw8WAh8ABQEyZGQCBA9kFgZmDw8WAh8ABQE0ZGQCAQ8PFgIfAAUIQkVSUk9DQVNkZAICDw8WAh8ABQE3ZGQCBQ9kFgZmDw8WAh8ABQMxMUFkZAIBDw8WAh8ABRBTVEEuIE1BUkkmIzIwOTtBZGQCAg8PFgIfAAUBOWRkAgYPDxYCHgdWaXNpYmxlaGRkAgkPD2QPEBYBZhYBFgIeDlBhcmFtZXRlclZhbHVlBQIyMBYBAgRkZBgBBQlHcmlkVmlldzEPPCsADAIEBQdNaW51dG9zCAICZFIHLsSv5v6+FexoaV6/9MEwCw20jHZO8I2vBFLw8GnG',
        '__EVENTTARGET': 'GridView1'
      }
    };
  } else {
    options = {
      'method': 'POST',
      'url': URLTIEMPO + req.params.id
    };
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const dom = new JSDOM(body);
      const table = dom.window.document.getElementById('GridView1');
      if (!table && table.rows.length < 3) return res.status(404).send('Sorry, cant find that');
      const toret = {
        "NombreParada": dom.window.document.getElementById('lblNombre').textContent,
        "Lineas": [],
        "NumPag": table.rows[table.rows.length - 1].querySelector("table").rows[0].cells.length
      }; // Se recorre las filas que necesitamos y pasrseamos los datos a un json

      for (var i = 0, row; row = table.rows[i]; i++) {
        // Se evitan la primera y ultima porque no dan informacion
        if (i !== 0 && i !== table.rows.length - 1) {
          const result = {
            "NumLinea": parseInt(row.cells[0].textContent),
            "NombreLinea": row.cells[1].textContent,
            "Tiempo": row.cells[2].textContent
          };
          toret.Lineas.push(result);
        }
      }

      return res.send(toret);
    }
  });
});
app.get('/api/stops', (req, res) => {
  fs.readFile('src/paradas.json', 'utf8', function (err, contents) {
    res.send(contents);
  });
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); // Esto consulta el listado de paradas que existen
// app.get('/stops', (req, res) => {
// 	request({url: URLPARADAS, encoding: "latin1"}, function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			const dom = new JSDOM(body);
// 			const table = dom.window.document.getElementById('caja_paradas').querySelector("table");
// 			const toret = [];
// 			// Se recorre las filas que necesitamos y pasrseamos los datos a un json
// 			for (var i = 0, row; row = table.rows[i]; i++) {
// 				// Se evitan la primera y ultima porque no dan informacion
// 				console.log(row.cells[1].textContent);
// 				const result = {
// 					"NumParada": row.cells[0].textContent,
// 					"NombreParada": row.cells[1].textContent,
// 					"Sentido": row.cells[2].textContent,
// 				}
// 				toret.push(result);
// 			}
// 			res.send(toret)
// 		}
// 	});
// })
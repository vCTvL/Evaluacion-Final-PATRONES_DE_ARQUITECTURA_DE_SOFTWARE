const express = require('express');
const path = require('path');
const prestamosRoutes = require('./routes/prestamosRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.listen(3003, () => {
  console.log('Microservicio Préstamos ejecutándose en puerto 3003');
});

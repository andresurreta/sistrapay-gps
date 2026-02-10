const express = require('express');
const axios = require('axios');
const cors = require('cors');
const xml2js = require('xml2js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get('/api/gps', async (req, res) => {
  try {
    const response = await axios.get(
      'https://bus.copay.com.uy:10443/pub/avl.xml',
      {
        timeout: 10000
      }
    );

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error detallado",
      error: error.message,
      code: error.code
    });
  }
});

app.get('/', (req, res) => {
  res.send("Servidor SIS.TRA.PAY funcionando 🚍");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const xml2js = require("xml2js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/api/gps", async (req, res) => {
    try {

        const response = await axios.get(
            "https://bus.copay.com.uy:10443/pub/avl.xml",
            { timeout: 10000 }
        );

        const parser = new xml2js.Parser({ explicitArray:false });
        const result = await parser.parseStringPromise(response.data);

        const vehiclesRaw = result?.avl?.vehicle || [];

        const vehicles = Array.isArray(vehiclesRaw)
            ? vehiclesRaw
            : [vehiclesRaw];

        const cleanData = vehicles.map(v => ({
            id: v.$?.id,
            lat: parseFloat(v.$?.lat),
            lon: parseFloat(v.$?.lon),
            linea: v.$?.route
        }));

        res.json({ vehicles: cleanData });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "No se pudo obtener GPS" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

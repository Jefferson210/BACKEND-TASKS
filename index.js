const express = require("express");
const conectarDB = require("./config/db");

//crear el servidor
const app = express();

//conectar a la DB
conectarDB();

//Habilitar express.json, nos permite leer datos que el usuario coloque
app.use(express.json({ extended: true }));

//puerto de la app
const PORT = process.env.PORT || 4000;

//Importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

//arrancar servidor
app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});

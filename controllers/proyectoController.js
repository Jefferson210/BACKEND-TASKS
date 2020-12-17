const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  try {
    //Crear un nuevo proyecto
    const proyecto = new Proyecto(req.body);
    //Guardar el creador vida jwt
    proyecto.creador = req.usuario.id;
    //Guardamos el proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

//Obtener los proyectos del usuarios logueado
exports.obtenerPoryecto = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  //Extraer la info del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    //revisar el Id
    let proyecto = await Proyecto.findById(req.params.id);

    //revisar si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //varificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    //Actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
};

//Eliminar proyecto por su id
exports.eliminarProyecto = async (req, res) => {
  try {
    //revisar el Id
    let proyecto = await Proyecto.findById(req.params.id);

    //revisar si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //varificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    //Eliminar
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
};

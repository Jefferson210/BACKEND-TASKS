const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crear una nueva tarea
exports.crearTarea = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  try {
    //Extraer el proyecto y verificar si existe
    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //Revisar si el proyecto actual pertenece al usuario logueado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    //Creamos la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtiene las tareas por proyectos
exports.obtenerTareas = async (req, res) => {
  try {
    //Extraer el proyecto y verificar si existe
    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //Revisar si el proyecto actual pertenece al usuario logueado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //obtener tareas
    const tareas = await Tarea.find({ proyecto });
    res.json(tareas);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //Extraer el proyecto y verificar si existe
    const { proyecto, nombre, estado } = req.body;
    //Revisar si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "No existe la tarea" });
    }
    //Revisar si el proyecto actual pertenece al usuario logueado
    const existeProyecto = await Proyecto.findById(proyecto);
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //Crear un objeto con la nueva informacion
    const nuevaTarea = {};
    if (nombre) nuevaTarea.nombre = nombre;
    if (estado) nuevaTarea.estado = estado;
    //Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//Elimnar tarea
exports.eliminarTarea = async (req, res) => {
  try {
    //Extraer el proyecto y verificar si existe
    const { proyecto } = req.body;
    //Revisar si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "No existe la tarea" });
    }
    //Revisar si el proyecto actual pertenece al usuario logueado
    const existeProyecto = await Proyecto.findById(proyecto);
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    //Eliminar
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

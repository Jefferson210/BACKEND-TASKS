const Usuario = require("../models/Usuario");
const bcryptjs = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Extraer el email y password
  const { email, password } = req.body;
  try {
    //Revisar que sea un usuario reistrado
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "Email o Password incorrecto" });
    }
    //Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Email o Password incorrecto" });
    }
    //Si todo es correcto
    //Cear y firmar el jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        //Mensaje de confirmacion
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//Obtiene el usuario autenticado
exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRepository = require("../repositories/usersRepository");

const login = async (req, res) => {
  try {
    const body = req.body;
    // validation
    if (!body.email || !body.password) {
      return res
        .status(400)
        .json({ status: false, response: "missing email, password from body" });
    }
    // mail exist check
    const result = await usersRepository.login(body.email);
    if (!result.count)
      return res.status(401).json({ status: false, response: "Invalid email" });

    // check
    const isValid = await bcrypt.compare(body.password, result.data.password);
    if (!isValid)
      return res
        .status(401)
        .json({ status: false, response: "Invalid password" });

    // token creation
    const token = jwt.sign({ id: result.data.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ status: true, response: token });
  } catch (error) {
    res.status(500).json({ status: false, response: error.message });
  }
};

const register = async (req, res) => {
  try {
    const body = req.body;
    // validation
    if (!body.email || !body.password) {
      return res
        .status(400)
        .json({ status: false, response: "missing email, password from body" });
    }

    const hash = await bcrypt.hash(body.password, 10);
    const result = await usersRepository.register(body.email, hash);
    res.status(200).json({
      status: true,
      response: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, response: error.message });
  }
};

module.exports = {
  login,
  register,
};

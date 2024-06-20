const { role } = require("../models");

const getRoles = async (req, res) => {
  try {
    const roles = await role.findAll();

    return res.status(200).json({ message: "success", roles });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getRoles };

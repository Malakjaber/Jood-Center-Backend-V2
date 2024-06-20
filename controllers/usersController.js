const { user, role: roleModel } = require("../models");
const { Op } = require("sequelize");

const getAllUsers = async (req, res) => {
  try {
    let role = req.query.role;

    if (!role) {
      return res.status(400).json({ message: "You should select a role" });
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    if (page < 1) {
      page = 1;
    }
    if (limit > 160 || limit < 1) {
      limit = 9;
    }

    const search = req.query.search;
    let conditions = {};

    if (search) {
      conditions.username = {
        [Op.like]: `%${search}%`,
      };
    }

    const roleInstance = await roleModel.findOne({ where: { name: role } });

    if (!roleInstance) {
      return res.status(400).json({ message: "Invalid role" });
    }

    conditions.roleId = roleInstance.id;

    const offset = (page - 1) * limit;

    const { count, rows: users } = await user.findAndCountAll({
      attributes: [
        ["userId", "id"],
        ["email", "email"],
        ["username", "username"],
        ["phone", "phone"],
        ["address", "address"],
      ],
      where: conditions,
      order: [["username", "ASC"]],
      limit,
      offset,
    });

    return res.status(200).json({ message: "success", count, users });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const foundUser = await user.findByPk(id, {
      include: roleModel,
      attributes: { exclude: ["password"] },
    });

    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "success", user: foundUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUsers, getUserById };

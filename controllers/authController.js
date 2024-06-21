const { user, role: roleModel } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { username, userId, email, password, role, phone, address } =
      req.body;

    const emailUsed = await user.findOne({ where: { email } });

    if (emailUsed) {
      return res.status(400).json({ error: "Email is already used" });
    }

    const idUsed = await user.findByPk(userId);

    if (idUsed) {
      return res.status(400).json({ error: "ID is already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const roleInstance = await roleModel.findByPk(role);

    if (!roleInstance) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const newUser = await user.create({
      userId,
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      roleId: role,
    });

    res.json({
      message: "success",
      newUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await user.findOne({
      where: { email },
      include: roleModel,
    });

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    if (!(await bcrypt.compare(password, foundUser.password))) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const userRole = await roleModel.findByPk(foundUser.roleId);

    const token = jwt.sign(
      { userId: foundUser.userId, role: userRole.name },
      process.env.JWT_SECRET,
      { expiresIn: "2y" }
    );

    const userdata = {
      userId: foundUser.userId,
      email: foundUser.email,
      username: foundUser.username,
      token,
      role: userRole.name,
    };

    res.json({
      message: "success",
      userdata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

// const signOut = async (req, res) => {
//   try {
//     const sessionId = req.headers.authorization;

//     const oldSession = await session.findOne({
//       where: { sid: sessionId },
//     });

//     if (!oldSession) {
//       return res.status(404).json({ error: "Session ID not found" });
//     }

//     // log out from current session
//     const deletedSessions = await session.destroy({
//       where: { sid: sessionId },
//     });

//     if (deletedSessions === 0) {
//       return res.status(404).json({ error: "Session ID not found" });
//     }

//     res.json({ message: "success" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

module.exports = { signUp, signIn };

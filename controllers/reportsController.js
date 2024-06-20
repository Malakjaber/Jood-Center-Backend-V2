const { sequelize } = require("../models");

const getReports = async (req, res) => {
  try {
    const { id, st_id, userId, date, limit = 10, page = 1 } = req.query;

    if (!id && !st_id && !userId && !date) {
      return res.sendStatus(400);
    }

    const conditions = {};

    if (id) {
      conditions.id = id;
    }
    if (st_id) {
      conditions.st_id = st_id;
    }
    if (userId) {
      conditions.userId = userId;
    }
    if (date) {
      conditions.date = date;
    }

    const offset = (page - 1) * limit;

    const data = await sequelize.models.report.findAndCountAll({
      where: conditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Fetch all user information
    const userIds = data.rows.map((report) => report.userId);
    const uniqueUserIds = [...new Set(userIds)];

    const users = await sequelize.models.user.findAll({
      where: { userId: uniqueUserIds },
    });

    // Create a map of user IDs to their names
    const userMap = {};
    users.forEach((user) => {
      userMap[user.userId] = user.username;
    });

    // Fetch all student information
    const studentIds = data.rows.map((report) => report.st_id);
    const uniqueStudentIds = [...new Set(studentIds)];

    const students = await sequelize.models.student.findAll({
      where: { st_id: uniqueStudentIds },
    });

    // Create a map of student IDs to their names
    const studentMap = {};
    students.forEach((student) => {
      studentMap[student.st_id] = student.name;
    });

    // Attach user's name and student's name to each report
    const reportsWithNames = data.rows.map((report) => ({
      ...report.toJSON(),
      teacherName: userMap[report.userId] || null,
      studentName: studentMap[report.st_id] || null,
    }));

    return res.status(200).json({
      message: "success",
      data: reportsWithNames,
      total: data.count,
      pages: Math.ceil(data.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

async function createReport(content, date, st_id, userId) {
  try {
    // First, validate that the student and user exist
    const studentExists = await sequelize.models.student.findByPk(st_id);
    if (!studentExists) {
      return { error: true, message: "Student not found" };
    }

    const userExists = await sequelize.models.user.findByPk(userId);
    if (!userExists) {
      return { error: true, message: "User not found" };
    }

    // Create the report
    const newReport = await sequelize.models.report.create({
      content: content,
      date: date,
      st_id: st_id,
      userId: userId,
    });

    return {
      message: "success",
      report: newReport,
    };
  } catch (error) {
    console.error("Error creating report", error);
    return { error: true, message: "Error creating report", details: error };
  }
}

module.exports = { getReports, createReport };

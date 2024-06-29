const { Op } = require("sequelize");
const { student, report } = require("../models");
const { sequelize } = require("../models");

const getAllStudents = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;
    let parentId = Number(req.query.parentId);

    if (page < 0) {
      page = 1;
    }
    if (limit > 160 || limit < 0) {
      limit = 12;
    }

    let search = req.query.search;
    let conditions = {};

    if (parentId) {
      parentId = parentId.toString();
      conditions.userId = parentId;
    }

    if (search) {
      search = search.toString();
      conditions.name = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const students = await student.findAll({
      where: conditions,
      order: [["name", "ASC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    const count = await student.count({
      where: conditions,
    });

    return res.status(200).json({ message: "success", count, students });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number.isNaN(id)) {
      return res.status(400);
    }

    let studentProfile = await student.findByPk(id);

    if (!studentProfile) {
      return res.status(400).json({ error: "Student not found" });
    }

    return res
      .status(200)
      .json({ message: "success", student: studentProfile });
  } catch (error) {
    return res.status(500);
  }
};
const addNewStudent = async (req, res) => {
  try {
    const {
      st_id,
      name,
      birth_date,
      pathological_case,
      phone,
      address,
      medicines,
      parent_id,
      class_id,
    } = req.body;

    if (!st_id) {
      return res.status(400).json({ error: "Student Id not provided" });
    }

    if (await student.findByPk(st_id)) {
      return res.status(400).json({ error: "Student Added Before" });
    }

    if (!(await sequelize.models.parent.findByPk(parent_id))) {
      return res.status(400).json({ error: "Parent Account Not Found" });
    }

    const newStudent = await student.create({
      st_id,
      name,
      birth_date,
      pathological_case,
      phone,
      address,
      medicines,
      class_id,
      parent_id,
    });

    res.json({
      message: "success",
      newStudent,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
const editStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    birth_date,
    pathological_case,
    phone,
    address,
    medicines,
    userId,
    class_id,
  } = req.body;
  try {
    // First, check if the student exists
    const studentProfile = await student.findByPk(id);
    if (!studentProfile) {
      return res.status(404).json({ error: "Student Not Found" });
    }

    const parentProfile = await sequelize.models.user.findByPk(userId);
    if (!parentProfile) {
      return res.status(404).json({ error: "Parent Account Not Found" });
    }

    const newClass = await sequelize.models.class.findByPk(class_id);
    if (!newClass) {
      return res.status(404).json({ error: "Class Doesn't Exists" });
    }

    // Update the student with new data
    const updatedStudent = await studentProfile.update({
      // ...(studentId && { st_id: studentId }),
      ...(name && { name }),
      ...(birth_date && { birth_date }),
      ...(pathological_case && { pathological_case }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(medicines && { medicines }),
      ...(userId && { userId }),
      ...(class_id && { class_id }),
    });

    return res.json({
      message: "success",
      student: updatedStudent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const removeStudent = async (req, res) => {
  try {
    const id = req.params.id;

    const existingReports = await report.findAll({
      where: { st_id: id },
    });

    if (existingReports.length > 0) {
      await report.destroy({
        where: { st_id: id },
      });
    }

    const deletedStudentCount = await student.destroy({
      where: { st_id: id },
    });

    if (deletedStudentCount === 0) {
      return res.status(404).json({ error: "Student Not Found" });
    }

    res.json({ message: "success", st_id: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getStudentsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    let classId = Number(req.query.classId);
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 12;
    let search = req.query.search;

    // First, get all the class IDs taught by the teacher
    const teacherClasses = await sequelize.models.teacher_class.findAll({
      where: { userId: teacherId },
      include: [
        {
          model: sequelize.models.class,
          where: classId ? { class_id: classId } : {},
        },
      ],
    });

    const classIds = teacherClasses.map((tc) => tc.class.class_id);

    // Query students directly related to the classes taught by the teacher
    const { count, rows: students } =
      await sequelize.models.student.findAndCountAll({
        where: {
          class_id: { [Op.in]: classIds },
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        limit: limit < 1 ? 12 : limit,
        offset: (page - 1) * limit,
        order: [["name", "ASC"]],
      });

    // Generate classes summary
    const classes = teacherClasses.map((tc) => {
      return { name: tc.class.name, class_id: tc.class.class_id };
    });

    // Prepare student data
    const studentsArray = students.map((student) => ({
      st_id: student.st_id,
      name: student.name,
    }));

    res.json({
      message: "success",
      classes,
      students: studentsArray,
      count,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
  getStudentsByTeacher,
  editStudent,
};

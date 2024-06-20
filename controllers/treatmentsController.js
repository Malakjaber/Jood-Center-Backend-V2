const { sequelize } = require("../models");

const getTreatments = async (req, res) => {
  try {
    const { id, classId, teacher_id, date, limit = 10, page = 1 } = req.query;

    if (!id && !classId && !teacher_id && !date) {
      return res.sendStatus(400);
    }

    const conditions = {};

    if (id) {
      conditions.id = id;
    }
    if (classId) {
      conditions.class_id = classId;
    }
    if (teacher_id) {
      conditions.teacher_id = teacher_id;
    }
    if (date) {
      conditions.date = date;
    }

    const offset = (page - 1) * limit;

    const data = await sequelize.models.treatment_plan.findAndCountAll({
      where: conditions,
      include: [
        {
          model: sequelize.models.class,
          attributes: ["name"],
        },
        {
          model: sequelize.models.user,
          attributes: ["username"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const formattedData = data.rows.map((plan) => ({
      ...plan.toJSON(),
      className: plan.class.name,
      teacherName: plan.user.username,
      class: undefined, // Optionally remove the original class object if not needed
      teacher: undefined, // Optionally remove the original teacher object if not needed
    }));

    return res.status(200).json({
      message: "success",
      data: formattedData,
      total: data.count,
      pages: Math.ceil(data.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

async function createTreatmentPlan(content, date, classId, teacherId) {
  try {
    // First, validate that the class and teacher exist
    const classExists = await sequelize.models.class.findByPk(classId);
    if (!classExists) {
      return { error: true, message: "Class Not Found" };
    }

    const teacherExists = await sequelize.models.user.findByPk(teacherId);
    if (!teacherExists) {
      return { error: true, message: "Teacher not found" };
    }

    // Create the report
    const newTreatmentPlan = await sequelize.models.treatment_plan.create({
      content: content,
      date: date,
      class_id: classId,
      teacher_id: teacherId,
    });

    return {
      message: "success",
      plan: newTreatmentPlan,
    };
  } catch (error) {
    console.error("Error creating treatment plan", error);
    return {
      error: true,
      message: "Error creating treatment plan",
      details: error,
    };
  }
}

const getStudentTreatmentPlans = async (req, res) => {
  try {
    const { studentId, limit = 10, page = 1 } = req.query;

    if (!studentId) {
      return res.sendStatus(400);
    }

    const student = await sequelize.models.student.findByPk(studentId, {
      include: {
        model: sequelize.models.class,
        include: {
          model: sequelize.models.treatment_plan,
          include: [
            {
              model: sequelize.models.user, // Include teacher details directly under treatment_plan
              attributes: ["username"],
            },
          ],
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Flatten the treatment plans and include the class name and teacher name
    const treatmentPlans = student.class.treatment_plans.map((plan) => ({
      ...plan.toJSON(),
      className: student.class.name,
      teacherName: plan.user?.username,
    }));

    const totalPlans = treatmentPlans.length;
    const offset = (page - 1) * limit;
    const paginatedPlans = treatmentPlans.slice(
      offset,
      offset + parseInt(limit)
    );

    return res.status(200).json({
      message: "success",
      data: paginatedPlans,
      total: totalPlans,
      pages: Math.ceil(totalPlans / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
module.exports = {
  getTreatments,
  createTreatmentPlan,
  getStudentTreatmentPlans,
};

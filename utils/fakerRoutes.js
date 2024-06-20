const { faker } = require("@faker-js/faker");
const { sequelize } = require("../models");

const generateRandomData = () => {
  const randomStudent = (userIds) => ({
    st_id: faker.helpers.replaceSymbols("##########"),
    name: faker.person.fullName(),
    birth_date: faker.date.anytime(),
    pathological_case: faker.string.alpha(10),
    phone: faker.helpers.replaceSymbols("##########"),
    address: faker.lorem.words({ min: 3, max: 6 }),
    medicines: faker.lorem.words({ min: 3, max: 6 }),
    class_id: faker.number.int({ min: 1, max: 6 }),
    userId: faker.helpers.arrayElement(userIds), // Random valid userId
  });

  const randomUser = (roleId) => ({
    userId: faker.helpers.replaceSymbols("##########"),
    phone: faker.helpers.replaceSymbols("##########"),
    username: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    address: faker.lorem.words({ min: 5, max: 8 }),
    roleId: roleId,
  });

  const randomReport = (studentIds, userIds) => ({
    content: faker.lorem.paragraph(),
    date: faker.date.recent(),
    st_id: faker.helpers.arrayElement(studentIds), // Random valid st_id
    userId: faker.helpers.arrayElement(userIds), // Random valid userId
  });

  const randomTreatmentPlan = (classIds, userIds) => ({
    content: faker.lorem.paragraph(),
    date: faker.date.recent(),
    class_id: faker.helpers.arrayElement(classIds), // Random valid class_id
    teacher_id: faker.helpers.arrayElement(userIds), // Random valid userId (teacher)
  });

  return { randomStudent, randomUser, randomReport, randomTreatmentPlan };
};

const fillDb = async (req, res) => {
  const { randomStudent, randomUser, randomReport, randomTreatmentPlan } =
    generateRandomData();

  await sequelize.sync({ force: true });

  // Fill Roles Table
  const roles = ["manager", "co_manager", "teacher", "parent"];
  for (const role of roles) {
    await sequelize.models.role.create({ name: role });
  }

  // Fill Users Table
  const teachers = [];
  const parents = [];

  for (let i = 0; i < 50; i++) {
    const roleId = faker.number.int({ min: 1, max: 4 });
    const user = await sequelize.models.user.create(randomUser(roleId));
    if (roleId === 3) {
      teachers.push(user.userId);
    }
    if (roleId === 4) {
      parents.push(user.userId);
    }
  }

  // Fill Classes Table
  const classesNames = [
    "Autism (A)",
    "Autism (B)",
    "Difficulty Of Learning (A)",
    "Difficulty Of Learning (B)",
    "Difficulty Of Speech (A)",
    "Difficulty Of Speech (B)",
  ];
  const classIds = [];

  for (const className of classesNames) {
    const classInstance = await sequelize.models.class.create({
      name: className,
    });
    classIds.push(classInstance.class_id);
  }

  // Fill Students Table
  const studentIds = [];
  for (let i = 0; i < 50; i++) {
    const student = await sequelize.models.student.create(
      randomStudent(parents)
    );
    studentIds.push(student.st_id);
  }

  // Fill Reports Table
  for (let i = 0; i < 70; i++) {
    await sequelize.models.report.create(randomReport(studentIds, teachers));
  }

  // Fill Reports Table
  for (let i = 0; i < 70; i++) {
    await sequelize.models.treatment_plan.create(
      randomTreatmentPlan(classIds, teachers)
    );
  }

  res.json({ message: "Database filled with fake data!" });
};

module.exports = {
  fillDb,
};

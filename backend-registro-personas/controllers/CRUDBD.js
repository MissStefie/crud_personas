const database = require("../database");

async function get_personas(req, res) {
  const connection = await database.getConnection();

  try {
    const query = "SELECT * FROM people where state = 1";

    const [results] = await connection.query(query);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
  } finally {
    connection.release();
  }
}

async function create_personas(req, res) {
  const connection = await database.getConnection();
  const {
    name,
    lastname,
    email,
    contact,
    department,
    city,
    gender,
    date_of_birth,
  } = req.body;

  try {
    const query = `
      INSERT INTO people (name, lastname, email, contact, department, city, gender, date_of_birth)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(query, [
      name,
      lastname,
      email,
      contact,
      department,
      city,
      gender,
      date_of_birth,
    ]);

    res
      .status(201)
      .json({ message: "Persona creada con éxito", personId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
  } finally {
    connection.release();
  }
}

async function update_personas(req, res) {
  const connection = await database.getConnection();
  const { id } = req.params;
  const {
    name,
    lastname,
    email,
    contact,
    department,
    city,
    gender,
    date_of_birth,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).send("ID de persona es requerido");
    }

    const query = `
      UPDATE people
      SET name = ?, lastname = ?, email = ?, contact = ?, department = ?, city = ?, gender = ?, date_of_birth = ?
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [
      name,
      lastname,
      email,
      contact,
      department,
      city,
      gender,
      date_of_birth,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Persona no encontrada");
    }

    res.status(200).send("Persona actualizada con éxito");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
  } finally {
    connection.release();
  }
}

async function delete_personas(req, res) {
  const connection = await database.getConnection();
  const { id } = req.params;

  try {
    const query = "UPDATE people SET state = 0 WHERE id = ?";
    const [result] = await connection.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Person not found");
    }

    res.status(200).send("Person state updated to 0 successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  } finally {
    connection.release();
  }
}

module.exports = {
  get_personas,
  delete_personas,
  create_personas,
  update_personas,
};

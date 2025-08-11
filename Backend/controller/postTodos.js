import Todo from "../db/TodoSchema.js";
export const postTodos = async (req, res) => {
  const { title, description, date } = req.body;
  const newTodo = new Todo({ title, description, date });
  try {
    await newTodo.save();
    res.status(201).send("Saved Successfullt");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving");
  }
};

const notesRepository = require("../repositories/notesRepository");

const get = async (req, res) => {
  try {
    const tags = req.query?.tags
      ? req.query.tags.split(",").map((tag) => tag.trim())
      : [];
    const result = await notesRepository.get(req.query?.user_id, tags);
    res.status(200).json({ status: true, response: result });
  } catch (error) {
    res.status(500).json({ status: false, response: error.message });
  }
};

const upsert = async (req, res) => {
  try {
    const { id, title, content, user_id, tags } = req.body;
    // validation
    if (!title || !content || !user_id) {
      return res.status(400).json({
        status: false,
        response: "missing title, content, user_id from body",
      });
    }

    if (id) {
      // Update
      const result = await notesRepository.update(id, title, content, tags);
      return res
        .status(200)
        .json({ status: true, response: "Updated successfully" });
    } else {
      // Create
      const result = await notesRepository.create(
        title,
        content,
        tags,
        user_id
      );
      return res
        .status(201)
        .json({ status: true, response: "Created successfully" });
    }
  } catch (error) {
    res.status(500).json({ status: false, response: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await notesRepository.remove(req.params);
    if (result.count > 0)
      res
        .status(200)
        .json({ status: true, response: { response: "Removed successfully" } });
    else
      res
        .status(400)
        .json({ status: false, response: { response: "ID not found" } });
  } catch (error) {
    res.status(500).json({ status: false, response: error.message });
  }
};

module.exports = {
  get,
  upsert,
  remove,
};

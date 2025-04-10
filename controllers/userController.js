import User from "../models/user.js";

// User Controller
const userController = {
  getAllUsers: async (req, res) => {
    try { const users = await User.findAll(); res.json(users); }
    catch (err) { res.status(500).json({ error: err.message }); }
  },
  createUser: async (req, res) => {
    try { const user = await User.create(req.body); res.status(201).json(user); }
    catch (err) { res.status(500).json({ error: err.message }); }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      await user.update(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      await user.destroy();
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }, 
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getForUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default userController
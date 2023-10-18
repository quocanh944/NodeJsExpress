import User from '../models/user.js';

export const add = async (req, res) => {
  try {
    const userData = req.body;

    const user = new User(userData);

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Lỗi khi tạo người dùng:', error);
    res.status(500).json({ error: 'Lỗi khi tạo người dùng' });
  }
};

export const getAll = async (req, res) => {
    try {
      const user = await User.find()
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng nào' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Lỗi khi đọc thông tin người dùng:', error);
      res.status(500).json({ error: 'Lỗi khi đọc thông tin người dùng' });
    }
  };

export const getById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng' });
  }
};

export const editById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật người dùng' });
  }
};

export const deleteById = async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndRemove(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      res.status(500).json({ error: 'Lỗi khi xóa người dùng' });
    }
  };

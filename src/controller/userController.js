import { add, getAllUsers, getById, deleteById, editById, signUp, activateUser } from '../service/userService.js'

const getListUsers = async (req, res) => {
  let users = await getAllUsers();
  res.render('partials/user', { title: "Quản lý người dùng", users })
}

export { getListUsers }

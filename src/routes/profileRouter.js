// userRouter.js
import express from 'express';
import {
    getCurrentProfile, updateProfile, updateAvatar, changePassword
} from '../controller/profileController.js'
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const singleUpload = upload.single("image");

const profileRouter = express.Router();

profileRouter.get('/', getCurrentProfile);
profileRouter.post('/', updateProfile)
profileRouter.post('/change-password', changePassword)
profileRouter.post('/update-avatar', function (req, res, next) {
    singleUpload(req, res, function (err) {
        if (err) {
            req.flash('msg', "File Not Found!")
            req.flash('status', "Failed")
            return res.redirect('/profile');
        } else {
            next();
        }
    });
}, updateAvatar)

export default profileRouter;

import config from '../config/config.js';
import { editById, updatePassword, getUserById } from '../service/userService.js'
import { uploadFirebase, deleteImageFromFirebase } from "./firebaseController.js";
import User from './../models/user.js'

const updateProfile = async (req, res) => {
    const { user } = req.session;
    const { fullName, birthday, phoneNumber, gender } = req.body;
    if (!fullName) {
        req.flash('msg', `Please enter your full name.`);
        req.flash('status', 'Failed');
        return res.redirect('/profile#accountDetails');
    }

    await editById(user._id, { fullName, birthday, phoneNumber, gender })

    const updatedUser = await getUserById(user._id);

    req.session.user = updatedUser

    req.flash('msg', `Profile updated successfully.`);
    req.flash('status', 'Success');
    return res.redirect('/profile#accountDetails')
}

const changePassword = async (req, res) => {
    const { user } = req.session;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // try {
    //     const user = await User.findOne({ email: username.trim() + '@gmail.com' });
    
    //     console.log(user)
    
    //     console.log(await user.isValidPassword(password))
    
    //     if (!user || !user.isActive || !(await user.isValidPassword(password))) {
    //       return res.redirect('/login');
    //     }
    
    //     req.session.user = user;
    
    //     if (user.isFirstLogin) {
    //       return res.redirect('/user/set-password');
    //     }
    
    //     return res.redirect('/');
    //   } catch (error) {
    //     console.error('Database query error', error);
    //     req.flash('error_msg', 'Lỗi báo BE');
    //     return res.redirect('/login');
    //   }


    if (!currentPassword || !newPassword || !confirmPassword) {
        req.flash('msg', `Please enter all field.`);
        req.flash('status', 'Failed');
        return res.redirect('/profile#changePassword')
    }

    if (newPassword != confirmPassword) {
        req.flash('msg', `Confirm password and new password not match.`);
        req.flash('status', 'Failed');
        return res.redirect('/profile#changePassword')
    }
    const currentUser = await getUserById(user._id);
    if (!currentUser || !currentUser.isActive || !(await currentUser.isValidPassword(currentPassword))) {
        req.flash('msg', `Incorrect Pasword.`);
        req.flash('status', 'Failed');
        return res.redirect('/profile#changePassword')
    }

    await updatePassword(currentUser.email, newPassword)

    req.flash('msg', `Password changed successfully.`);
    req.flash('status', 'Success');
    return res.redirect('/profile#changePassword');
}

const updateAvatar = async (req, res) => {
    const { user } = req.session;

    const avatar = await uploadFirebase(req.file);

    await deleteImageFromFirebase(user.avatar);
    await editById(user._id, { avatar: avatar.downloadURL })
    const updatedUser = await getUserById(user._id);
    req.session.user = updatedUser

    req.flash('msg', `Avatar updated successfully.`);
    req.flash('status', 'Success');
    return res.redirect('/profile#accountDetails')
}

const getCurrentProfile = async (req, res) => {
    const msg = req.flash('msg');
    const status = req.flash('status');
    const { user } = req.session;
    if (user.role === 'ADMIN') {
        return res.render('pages/admin-profile', {
            title: "Profile", user,
            msg,
            status
        })
    }
    return res.render('pages/current-profile', {
        title: "Profile", user,
        msg,
        status
    })
};

export {
    updateProfile,
    getCurrentProfile,
    updateAvatar,
    changePassword
}

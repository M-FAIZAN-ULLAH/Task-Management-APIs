const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/users")
const multer = require("multer")

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("please upload an image!"))
        }
        cb(undefined, true)
    }
}
)

const router = new express.Router()


const {CreateUser, GetUser, GetUserbyId, UpdateUser, DeleteUser, LoginUser, GetAuthUser, LogoutUser, LogoutAll, AvatarUpload, AvatarUploadError, getAvatar, DeleteAvatar, sendEmail} = require("../controllers/user")

router.route("/users").post(CreateUser).get(GetUser)
router.route("/users/:id").get(GetUserbyId).patch(UpdateUser)

router.route("/users/login").post(LoginUser)

router.route("/authuser").get(auth,GetAuthUser)
router.route("/users/logout").post(auth, LogoutUser)
router.route("/logoutall").post(auth, LogoutAll)

router.route("/userdelete").delete(auth, DeleteUser)
router.route("/updateuser").patch(auth,UpdateUser)

router.route("/useravatar").post(auth, upload.single("avatar"),AvatarUpload, AvatarUploadError).get(auth, getAvatar).delete(auth,DeleteAvatar)
router.post('/sendemail', auth, sendEmail)


 module.exports = router
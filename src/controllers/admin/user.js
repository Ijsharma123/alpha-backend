const bcrypt = require("bcryptjs")
const User = require("../../models/admin/userSchema")
const UserGroup = require("../../models/admin/userGroup")


/** Add User */
exports.addUser = async function addUser(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        const add = await User.find({ email })

        if (add.length >= 1) {
            return res.status(401).globalResponse({ success: false, message: "User already exists" })
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(401).globalResponse({ success: false, err: err.message })
                } else {
                    const Add = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        group_id: req.body.group_id,
                        access: req.body.access
                    })
                    Add.save()
                    res.status(200).globalResponse({ success: true, message: "User added" });

                }
            })
        }
    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}




/** Edit User */
exports.editUser = async function editUser(req, res) {
    const _id = req.params
    const data = req.body
    try {
        const user = await User.findByIdAndUpdate(_id, {
            name: data.name,
            group_id: data.group_id,
            access: data.access
        })
        return res.status(200).globalResponse({ success: true, message: "Update Successfull" })
    } catch (err) {
        return res.status(401).globalResponse({ success: false, err: err.message })
    }
}



/** User List */
exports.userList = async function userList(req, res) {
    try {
        let matchobj = {}
        if (req.query.group_id) {
            matchobj['group_id'] = mongoose.Types.ObjectId(req.query.group_id)
        }
        const List = await User.aggregate([
            {
                $match: { ...matchobj }
            },
            {
                $lookup: {
                    from: 'user-groups',
                    localField: 'group_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    user_name: 1,
                    user_group_name: "$user.name",
                    email: 1,
                    group_id: 1,
                    access: 1
                }
            }

        ])
       
        return res.status(200).globalResponse({ success: true, data: List })
    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}



/** Active User List */
exports.activeUser = async function activeUser(req, res) {
    try {
        const List = await User.find({ status: "active" })
        return res.status(401).globalResponse({ success: true, count: List.length, data: List })
    } catch (err) {
        return res.status(401).globalResponse({ success: false, err: err.message })
    }
}



/** User Delete */
exports.userDelete = async function userDelete(req, res) {
    const _id = req.params
    try {
        const user = await User.findByIdAndDelete(_id)
        return res.status(200).globalResponse({ success: true, message: "Delete Successfull" })
    } catch (err) {
        return res.status(401).globalResponse({ success: false, err: err.message })
    }
}



/** User Group Add */
exports.userGroupAdd = async function userGroupAdd(req, res) {
    try {
        const user = new UserGroup({
            name: req.body.name,
            status: req.body.status
        })
        user.save()
        return res.status(200).json({ success: true, message: "User Group Added Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** User Group List */
exports.userGroup = async function userGroup(req, res) {
    try {
        const user = await UserGroup.find()
        return res.status(200).globalResponse({ success: true, data: user })
    } catch (err) {
        return res.status(401).globalResponse({ success: false, err: err.message })
    }
}
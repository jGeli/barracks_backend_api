import moment from "moment";
import asyncHandler from "../middleware/asyncHandler.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";


export const addTimelogs = asyncHandler (async (req, res, next) => {
    let type = req.params.type
    let userId = req.user.id;
    let user = await User.findById(userId);
    let attendance = await AttendanceRecord.find({userId: userId});
    let lastAttendanceReport = attendance.pop();
    
    if (user.isClockIn === false) {
        if (user.isClockIn === true) {
            return next(new ErrorResponse(404, "You already Clocked-in"));
        }
        
        attendance = await AttendanceRecord.create({
            login: moment().format("YYYY-MM-DD"),
            userId: userId
        })
        user.isClockIn = true;
        user.status = 'Online';
        user.save();
    } else {
        let diff;

        attendance = await AttendanceRecord.findOneAndUpdate({
            _id: lastAttendanceReport._id,
            userId: userId
        },
        {
            logout: moment.utc().format("YYYY-MM-DD"),
            duration: moment(attendance.logout, "YYY-MM-DD HH:mm:ss").diff(attendance.login, "YYY-MM-DD HH:mm:ss")
        },
        {
            new: true
        })

        user.isClockIn = false;
        user.status = 'Offline';
        await user.save();

    }



    res.status(200).json({
        c: 200,
        m: "Success",
        d: {}
    })
})
import mongoose from "mongoose";
import colors from "colors";

// Connect to DB
mongoose.set('strictQuery', false);

const connectDB = async () => {
    let conn;
    if (process.env.NODE_ENV === "development") {
        conn = await mongoose.connect(
            process.env.PRIMARY_CONNECTION_STRING,
            {}
        );
    } else if (process.env.NODE_ENV === "test") {
        conn = await mongoose.connect(
            process.env.PRIMARY_CONNECTION_STRING,
            {}
        );
    } else {
        conn = await mongoose.connect(
            process.env.PRIMARY_CONNECTION_STRING,
            {}
        );
    }

    console.log(
        `MongoDB connected: ${conn.connection.host}`.cyan.underline.bold
    );

    return conn;
};

export default connectDB;

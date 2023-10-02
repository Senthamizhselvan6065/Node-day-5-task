const mongoose = require("mongoose");
const async_handler = require("express-async-handler")

const connectMongoDB = async_handler ( async () => {
    await mongoose.connect(`mongodb+srv://forgot-password:forgot@cluster0.tfnjtzq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
     });
     console.log("MongoDB connect successfully...");
});

module.exports = connectMongoDB;
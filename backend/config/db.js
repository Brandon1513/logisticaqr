const mongoose = require("mongoose");

const connectBD = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            UseUnifiedTopology: true,
        });
        console.log("MongoDB Conectado");
    } catch(err){
        console.error("Error al conectar con MongoDB: ", err);
        process.exit(1);
    }
};

module.exports = connectBD;
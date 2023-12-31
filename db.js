const mongoose = require('mongoose');

const connectToMongo = () => {
    const Mongo_URI = 'mongodb+srv://Moazzam:moazzam123@cluster-1.hg3moin.mongodb.net/NIS-CEP';
    mongoose.connect(Mongo_URI).then(() => {
        console.log('Connected to DB Successfully!');
    }).catch((error) => {
        console.log(error);
    });
}

module.exports = connectToMongo;
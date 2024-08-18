import mongoose from 'mongoose'

const connected = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("databse connected")
    } catch (error) {
        console.log('unable to connect to database', error)
        process.exit(1)
    }
}

export {connected}
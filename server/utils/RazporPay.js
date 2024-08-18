import Razorpay from 'razorpay'

const instance = new Razorpay({
    key_id: process.env.Razorpay_KEY,
    key_secret: process.env.Razorpay_SECRET
})

export {
    instance
}
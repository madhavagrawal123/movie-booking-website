const razorpay = require("../utils/razorpay");
const crypto = require("crypto");


async function verifyPayment (req,res){

    const {

        razorpay_payment_id,

        razorpay_order_id,

        razorpay_signature

    } = req.body;

    const body =
        razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature =
        crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

    if (expectedSignature !== razorpay_signature) {

        return res.status(400).json({
            success: false,
            message: "Payment Verification Failed"
        });

    }

    // Payment Verified

    res.json({
        success: true
    });

}
async function createOrder(req, res) {
    console.log("createOrder controller hit");
    console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
    
    try {
        
         const { showId, seatNumbers } = req.body;

        if (!showId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking details"
            });
        }

        const SEAT_PRICE = 200;

        const amount = seatNumbers.length * SEAT_PRICE;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order
        });

    } catch (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
module.exports = {
    createOrder,
    verifyPayment
};
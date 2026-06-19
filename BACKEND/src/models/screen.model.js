const mongoose = require('mongoose');
const screenSchema = new mongoose.Schema({


    theatreId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Theatre',
        required:true
    },

    screenName:{
        type:String,
        required:true
    },

    rows:{
        type:Number,
        required:true
    },

    seatsPerRow:{
        type:Number,
        required:true
    },

    seats:[
        {
            seatNumber:String,

            type:{
                type:String,
                enum:["NORMAL","VIP","RECLINER"],
                default:"NORMAL"
            }
        }
    ]
});
module.exports = mongoose.model('Screen', screenSchema);
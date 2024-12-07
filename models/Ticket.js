const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
},
ticketCode: {
    type: String,
    unique: true,
    required: true
},
purchasedAt: {
    type: Date,
    default: Date.now
},
seatNumber: {
    type: Number,
  
},
noOfTickets:{
  type:Number,
  default:1
},
isUsed: {
    type: Boolean,
    default: false
}
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

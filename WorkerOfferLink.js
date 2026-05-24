const mongoose = require("mongoose");

const workerOfferLinkSchema = new mongoose.Schema({
  workerId:  { type: String, required: true },
  offerId:   { type: String, required: true },
  offerName: { type: String, required: true },
  customLink:{ type: String, required: true },
  note:      { type: String, default: "" },
}, { timestamps: true });

// One entry per worker+offer combo
workerOfferLinkSchema.index({ workerId: 1, offerId: 1 }, { unique: true });

module.exports = mongoose.model("WorkerOfferLink", workerOfferLinkSchema);

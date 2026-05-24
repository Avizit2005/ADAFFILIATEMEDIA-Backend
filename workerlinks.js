const router = require("express").Router();
const WorkerOfferLink = require("./WorkerOfferLink");
const auth = require("./authmw");

// Admin: set/update custom link for a worker+offer
router.post("/", auth.adminOnly, async (req, res) => {
  try {
    const { workerId, offerId, offerName, customLink, note } = req.body;
    if (!workerId || !offerId || !customLink) return res.status(400).json({ error: "workerId, offerId, customLink required" });

    // Upsert — create or update
    const link = await WorkerOfferLink.findOneAndUpdate(
      { workerId, offerId },
      { workerId, offerId, offerName: offerName || offerId, customLink, note: note || "" },
      { upsert: true, new: true }
    );
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get all custom links (optionally filter by workerId)
router.get("/", auth.adminOnly, async (req, res) => {
  const filter = req.query.workerId ? { workerId: req.query.workerId } : {};
  const links = await WorkerOfferLink.find(filter).sort({ workerId: 1, offerId: 1 });
  res.json(links);
});

// Admin: delete a custom link
router.delete("/:id", auth.adminOnly, async (req, res) => {
  await WorkerOfferLink.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Worker: get their own custom links
router.get("/mine", auth, async (req, res) => {
  const links = await WorkerOfferLink.find({ workerId: req.user.workerId });
  res.json(links);
});

module.exports = router;

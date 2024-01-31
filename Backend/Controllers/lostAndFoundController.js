const LostAndFound = require("../Models/lostAndFound");

const postLostAndFound = async (req, res) => {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ message: "You are not allowed to post lost and found" });
  if (!req.body.title || !req.body.description)
    return res.status(400).json({ message: "fill all fields" });

  const createdLostAndFound = new LostAndFound({
    title: req.body.title,
    description: req.body.description,
    picture: req.body.picture
      ? req.body.picture
      : "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg",
  });
  try {
    const savedLostAndFound = await createdLostAndFound.save();
    res.status(200).json(savedLostAndFound);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchLostAndFound = async (req, res) => {
  try {
    const lostAndFound = await LostAndFound.find().sort({ updatedAt: -1 });
    res.status(200).json(lostAndFound);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLostAndFound = async (req, res) => {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ message: "You are not allowed to update lost  and founds" });

  try {
    const updatedLostAndFound = await LostAndFound.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedLostAndFound);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteLostAndFound = async (req, res) => {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ message: "You are not allowed to delete lost and founds" });
  try {
    const deletedLostAndFound = await LostAndFound.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json({ message: "Lost and found deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postLostAndFound = postLostAndFound;
module.exports.fetchLostAndFound = fetchLostAndFound;
module.exports.updateLostAndFound = updateLostAndFound;
module.exports.deleteLostAndFound = deleteLostAndFound;

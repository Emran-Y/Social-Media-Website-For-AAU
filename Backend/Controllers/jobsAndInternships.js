const JobsAndInternships = require("../Models/jobsAndInternships");

const postJobAndInternship = async (req, res) => {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ message: "You are not allowed to post jobs and internships" });
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.deadline ||
    !req.body.link ||
    !req.body.company
  )
    return res.status(400).json({ message: "fill all fields" });

  const createdJobOrInternship = new JobsAndInternships({
    title: req.body.title,
    description: req.body.description,
    deadline: req.body.deadline,
    link: req.body.link,
    company: req.body.company,
    picture: req.body.picture
      ? req.body.picture
      : "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg",
  });
  try {
    const savedJobOrInternship = await createdJobOrInternship.save();
    res.status(200).json(savedJobOrInternship);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchJobAndInternship = async (req, res) => {
  try {
    const jobsAndInternships = await JobsAndInternships.find().sort({
      updatedAt: -1,
    });
    res.status(200).json(jobsAndInternships);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postJobAndInternship = postJobAndInternship;
module.exports.fetchJobAndInternship = fetchJobAndInternship;

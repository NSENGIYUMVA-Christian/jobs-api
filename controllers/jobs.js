const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
///////////////get all jobs
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  // send to front end
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

/////// get a single job
const getJob = async (req, res) => {
  // destructuring jobId and userId
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  // find that particular jon from db
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  // if job not found
  if (!job) {
    throw new NotFoundError(`No  job with id ${jobId}`);
  }
  // if job found
  res.status(StatusCodes.OK).json({ job });
};

//// create a job
const createJob = async (req, res) => {
  // added createBy property to req.body
  req.body.createdBy = req.user.userId;
  // create a new job
  const job = await Job.create(req.body);
  //send
  res.status(StatusCodes.CREATED).json({ job });
};

/// update a job
const updateJob = async (req, res) => {
  // destructuring jobId ,userId and body
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  //check if the company or the position is empty
  if (company === "" || position === "") {
    throw new BadRequestError("company or position fields can not be empty");
  }
  // if company and position provided
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  // if job not found
  if (!job) {
    throw new NotFoundError(`No  job with id ${jobId}`);
  }
  // if job found
  res.status(StatusCodes.OK).json({ job });
};
/// delete a job
const deleteJob = async (req, res) => {
  // destructuring jobId and  userId
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  // find job and delete
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  // if job not found
  if (!job) {
    throw new NotFoundError(`No  job with id ${jobId}`);
  }
  // if job found
  res.status(StatusCodes.OK).send("deleted successfully");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };

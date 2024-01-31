const JobsAndInternships = require('../Models/jobsAndInternships');
const postJobAndInternship = require('./jobsAndInternships').postJobAndInternship;

describe('postJobAndInternship', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        isAdmin: true
      },
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 403 if user is not an admin', async () => {
    req.user.isAdmin = false;

    await postJobAndInternship(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to post jobs and internships' });
  });

  test('should return 400 if any required field is missing', async () => {
    req.body.title = 'Test Title';
    req.body.description = 'Test Description';
    req.body.deadline = '2022-12-31';
    req.body.link = 'https://example.com';
    req.body.company = 'Test Company';

    // Missing picture field intentionally

    await postJobAndInternship(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'fill all fields' });
  });

  test('should create and save job/internship with default picture', async () => {
    req.body.title = 'Test Title';
    req.body.description = 'Test Description';
    req.body.deadline = '2022-12-31';
    req.body.link = 'https://example.com';
    req.body.company = 'Test Company';

    const jobOrInternshipSaved = {
      _id: 'jobOrInternshipId',
      title: 'Test Title',
      description: 'Test Description',
      deadline: '2022-12-31',
      link: 'https://example.com',
      company: 'Test Company',
      picture: 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg'
    };
    JobsAndInternships.prototype.save = jest.fn().mockResolvedValue(jobOrInternshipSaved);

    await postJobAndInternship(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(jobOrInternshipSaved);
  });

  test('should create and save job/internship with custom picture', async () => {
    req.body.title = 'Test Title';
    req.body.description = 'Test Description';
    req.body.deadline = '2022-12-31';
    req.body.link = 'https://example.com';
    req.body.company = 'Test Company';
    req.body.picture = 'https://example.com/test.jpg';

    const jobOrInternshipSaved = {
      _id: 'jobOrInternshipId',
      title: 'Test Title',
      description: 'Test Description',
      deadline: '2022-12-31',
      link: 'https://example.com',
      company: 'Test Company',
      picture: 'https://example.com/test.jpg'
    };
    JobsAndInternships.prototype.save = jest.fn().mockResolvedValue(jobOrInternshipSaved);

    await postJobAndInternship(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(jobOrInternshipSaved);
  });

  test('should handle internal server error when saving job/internship', async () => {
    req.body.title = 'Test Title';
    req.body.description = 'Test Description';
    req.body.deadline = '2022-12-31';
    req.body.link = 'https://example.com';
    req.body.company = 'Test Company';

    JobsAndInternships.prototype.save = jest.fn().mockRejectedValue(new Error('Error saving job/internship'));

    await postJobAndInternship(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
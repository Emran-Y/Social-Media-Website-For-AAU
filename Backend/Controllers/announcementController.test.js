const Announcement = require('../Models/announcement');
const postAnnouncement = require('./announcementController').postAnnouncement;

describe('postAnnouncement', () => {
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

    await postAnnouncement(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to post announcements' });
  });

  test('should return 400 if title or description is missing', async () => {
    req.body.title = 'Test Title';

    await postAnnouncement(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'fill all fields' });
  });

  test('should create and save announcement with default picture', async () => {
    req.body.title = 'Test Title';
    req.body.description = 'Test Description';

    const announcementSaved = {
      _id: 'announcementId',
      description: 'Test Description',
      title: 'Test Title',
      picture: 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg'
    };
    Announcement.prototype.save = jest.fn().mockResolvedValue(announcementSaved);

    await postAnnouncement(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(announcementSaved);
  });

  test('should create and save announcement with custom picture', async () => {
    req.body.title = 'Test Title';
    req.body.description = 'Test Description';
    req.body.picture = 'https://example.com/test.jpg';

    const announcementSaved = {
      _id: 'announcementId',
      description: 'Test Description',
      title: 'Test Title',
      picture: 'https://example.com/test.jpg'
    };
    Announcement.prototype.save = jest.fn().mockResolvedValue(announcementSaved);

    await postAnnouncement(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(announcementSaved);
  });

  test('should handle internal server error when saving announcement', async () => {
    req.body.title = 'Test Title';
    req.body.description = 'Test Description';

    Announcement.prototype.save = jest.fn().mockRejectedValue(new Error('Error saving announcement'));

    await postAnnouncement(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
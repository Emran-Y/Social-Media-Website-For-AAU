const { postComment } = require('./commentController');
const Comment = require('../Models/comment');

describe('postComment', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        announcementId: 'announcementId',
        content: 'Test comment',
      },
      user: {
        _id: 'userId',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and save a new comment', async () => {
    const commentCreated = {
      _id: 'commentId',
      content: 'Test comment',
      userId: 'userId',
      announcementId: 'announcementId',
    };

    Comment.prototype.save = jest.fn().mockResolvedValue(commentCreated);
    Comment.findById = jest.fn().mockResolvedValue(commentCreated);

    await postComment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(commentCreated);
    expect(Comment.prototype.save).toHaveBeenCalledWith();
    expect(Comment.findById).toHaveBeenCalledWith('commentId');
  });

  it('should return an error response when required fields are missing', async () => {
    req.body.announcementId = '';
    req.body.content = '';

    await postComment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Fill all fields' });
    expect(Comment.prototype.save).not.toHaveBeenCalled();
    expect(Comment.findById).not.toHaveBeenCalled();
  });

  it('should return an error response when an exception occurs', async () => {
    Comment.prototype.save = jest.fn().mockRejectedValue(new Error('Test error'));

    await postComment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(Comment.prototype.save).toHaveBeenCalledWith();
    expect(Comment.findById).not.toHaveBeenCalled();
  });
});
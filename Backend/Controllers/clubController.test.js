const { acceptClubJoinRequest } = require('./clubController');
const User = require('../Models/user');
const Club = require('../Models/club');

describe('acceptClubJoinRequest', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        clubAdmin: 'adminId'
      },
      params: {
        id: 'userId'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 if user is not a club admin', async () => {
    req.user.clubAdmin = null;

    await acceptClubJoinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith('You are not allowed to accept club join requests.');
  });

  it('should return 403 if user has not sent a request to join the club', async () => {
    User.findById = jest.fn().mockResolvedValue({ pendingClubRequests: [] });

    await acceptClubJoinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith('This user has not sent a request to join your club.');
  });

  it('should accept the club join request and update user and club data', async () => {
    const user = {
      _id: 'userId',
      pendingClubRequests: ['clubId1', 'clubId2'],
      clubMemberships: []
    };
    const club = {
      _id: 'clubId1',
      users: []
    };

    User.findById = jest.fn().mockResolvedValue(user);
    Club.findById = jest.fn().mockResolvedValue(club);
    User.prototype.save = jest.fn();
    Club.prototype.save = jest.fn();

    await acceptClubJoinRequest(req, res);

    expect(user.pendingClubRequests).toEqual(['clubId2']);
    expect(user.clubMemberships).toEqual(['clubId1']);
    expect(club.users).toEqual(['userId']);
    expect(User.prototype.save).toHaveBeenCalled();
    expect(Club.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Request accepted successfully.');
  });

  it('should return 500 if an error occurs', async () => {
    User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

    await acceptClubJoinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(new Error('Database error'));
  });
});
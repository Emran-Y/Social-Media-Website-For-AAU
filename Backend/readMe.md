## User API Documentation

### 1. Login User

#### `POST /api/user/login`

Authenticate and log in a user.

**Request:**
```json
{
  "username": "exampleUsername",
  "password": "examplePassword"
}
```

**Response:**
```json
{
  "_id": "userId",
  "token": "jwtToken",
  "isAdmin": true,
  "fullName": "John Doe",
  "username": "exampleUsername",
  "clubAdmin": "clubAdminId",
  "activities": {
    "likes": ["announcementId1", "announcementId2"]
  },
  "fieldOfStudy": "Computer Science",
  "universityId": "123456",
  "profilePicture": "https://example.com/profile.jpg",
  "clubMemberships": ["clubId1", "clubId2"],
  "pendingClubRequests": ["clubId3", "clubId4"]
}
```

### 2. Register User

#### `POST /api/user/register`

Register a new user.

**Request:**
```json
{
  "universityId": "123456",
  "universityPassword": "examplePassword",
  "fullName": "John Doe",
  "fieldOfStudy": "Computer Science",
  "username": "exampleUsername",
  "password": "examplePassword",
  "profilePicture": "https://example.com/profile.jpg"
}
```

**Response:**
```json
{
  "_id": "userId",
  "token": "jwtToken",
  "isAdmin": false,
  "fullName": "John Doe",
  "username": "exampleUsername",
  "clubAdmin": null,
  "activities": {
    "likes": []
  },
  "fieldOfStudy": "Computer Science",
  "universityId": "123456",
  "profilePicture": "https://example.com/profile.jpg",
  "clubMemberships": [],
  "pendingClubRequests": []
}
```

### 3. Fetch User

#### `GET /api/user/:userId`

Fetch user details by user ID.

**Response:**
```json
{
  "_id": "userId",
  "fullName": "John Doe",
  "profilePicture": "https://example.com/profile.jpg",
  "fieldOfStudy": "Computer Science"
}
```

### 4. Fetch Likes

#### `GET /api/user/likes`

Fetch announcements liked by the user.

**Response:**
```json
[
  {
    "_id": "announcementId1",
    "title": "Announcement 1",
    "description": "Description 1"
  },
  {
    "_id": "announcementId2",
    "title": "Announcement 2",
    "description": "Description 2"
  }
]
```

### 5. Fetch Comments

#### `GET /api/user/comments`

Fetch comments posted by the user.

**Response:**
```json
[
  {
    "_id": "commentId1",
    "announcementId": "announcementId1",
    "text": "Comment 1"
  },
  {
    "_id": "commentId2",
    "announcementId": "announcementId2",
    "text": "Comment 2"
  }
]
```

### 6. Like Announcement

#### `GET /api/user/like/:announcementId`

Like or unlike an announcement.

**Response:**
```json
{
  "_id": "announcementId",
  "title": "Announcement Title",
  "description": "Announcement Description",
  "likes": ["userId1", "userId2"]
}
```

### 7. Edit Profile

#### `PUT /api/user/editProfile`

Edit user profile details.

**Request:**
```json
{
  "fullName": "Updated Name",
  "fieldOfStudy": "Updated Field",
  "profilePicture": "https://example.com/updated.jpg"
}
```

**Response:**
```json
{
  "_id": "userId",
  "token": "jwtToken",
  "isAdmin": false,
  "fullName": "Updated Name",
  "username": "exampleUsername",
  "clubAdmin": null,
  "activities": {
    "likes": []
  },
  "fieldOfStudy": "Updated Field",
  "universityId": "123456",
  "profilePicture": "https://example.com/updated.jpg",
  "clubMemberships": [],
  "pendingClubRequests": []
}
```

## Announcement API Documentation

### 1. Fetch All Announcements

#### `GET /api/announcement/`

Fetch all announcements.

**Response:**
```json
[
  {
    "_id": "announcementId1",
    "title": "Announcement 1",
    "description": "Description 1",
    "picture": "https://example.com/picture1.jpg",
    "updatedAt": "2024-02-01T12:34:56.789Z",
    "createdAt": "2024-01-31T12:34:56.789Z"
  },
  {
    "_id": "announcementId2",
    "title": "Announcement 2",
    "description": "Description 2",
    "picture": "https://example.com/picture2.jpg",
    "updatedAt": "2024-02-01T12:45:00.000Z",
    "createdAt": "2024-01-31T12:45:00.000Z"
  }
  // ... additional announcements
]
```

### 2. Post Announcement

#### `POST /api/announcement/post`

Post a new announcement.

**Request:**
```json
{
  "title": "New Announcement",
  "description": "This is a new announcement",
  "picture": "https://example.com/new-picture.jpg"
}
```

**Response:**
```json
{
  "_id": "newAnnouncementId",
  "title": "New Announcement",
  "description": "This is a new announcement",
  "picture": "https://example.com/new-picture.jpg",
  "updatedAt": "2024-02-01T13:00:00.000Z",
  "createdAt": "2024-02-01T13:00:00.000Z"
}
```

### 3. Fetch All Comments for Announcement

#### `GET /api/announcement/allcomments/:announcementId`

Fetch all comments for a specific announcement.

**Response:**
```json
[
  {
    "_id": "commentId1",
    "userId": {
      "_id": "userId1",
      "fullName": "John Doe",
      "profilePicture": "https://example.com/profile1.jpg"
    },
    "text": "Comment 1",
    "updatedAt": "2024-02-01T13:10:00.000Z",
    "createdAt": "2024-02-01T13:10:00.000Z"
  },
  {
    "_id": "commentId2",
    "userId": {
      "_id": "userId2",
      "fullName": "Jane Doe",
      "profilePicture": "https://example.com/profile2.jpg"
    },
    "text": "Comment 2",
    "updatedAt": "2024-02-01T13:15:00.000Z",
    "createdAt": "2024-02-01T13:15:00.000Z"
  }
  // ... additional comments
]
```

### 4. Delete Announcement

#### `DELETE /api/announcement/delete/:announcementId`

Delete a specific announcement.

**Response:**
```json
{
  "message": "Announcement and associated data deleted"
}
```

### 5. Update Announcement

#### `PUT /api/announcement/update/:announcementId`

Update a specific announcement.

**Request:**
```json
{
  "title": "Updated Announcement",
  "description": "This is an updated announcement",
  "picture": "https://example.com/updated-picture.jpg"
}
```

**Response:**
```json
{
  "_id": "announcementId",
  "title": "Updated Announcement",
  "description": "This is an updated announcement",
  "picture": "https://example.com/updated-picture.jpg",
  "updatedAt": "2024-02-01T13:30:00.000Z",
  "createdAt": "2024-02-01T13:00:00.000Z"
}
```

## Club API Documentation

### 1. Fetch All Clubs

#### `GET /api/clubs/allClubs`

Fetch all clubs that the user is not a member of.

**Response:**
```json
[
  {
    "_id": "clubId1",
    "name": "Club 1",
    "description": "Description 1",
    "profilePicture": "https://example.com/picture1.jpg",
    "admin": {
      "_id": "adminId1",
      "fullName": "Admin 1",
      "username": "admin1"
    },
    "createdAt": "2024-02-01T12:34:56.789Z",
    "updatedAt": "2024-02-01T12:34:56.789Z"
  },
  {
    "_id": "clubId2",
    "name": "Club 2",
    "description": "Description 2",
    "profilePicture": "https://example.com/picture2.jpg",
    "admin": {
      "_id": "adminId2",
      "fullName": "Admin 2",
      "username": "admin2"
    },
    "createdAt": "2024-02-01T12:45:00.000Z",
    "updatedAt": "2024-02-01T12:45:00.000Z"
  }
  // ... additional clubs
]
```

### 2. Fetch Pending Club Requests

#### `GET /api/clubs/pendingClubRequests`

Fetch all clubs to which the user has sent join requests.

**Response:**
```json
[
  {
    "_id": "clubId1",
    "name": "Club 1",
    "description": "Description 1",
    "admin": {
      "_id": "adminId1",
      "fullName": "Admin 1",
      "username": "admin1"
    },
    "createdAt": "2024-02-01T12:34:56.789Z",
    "updatedAt": "2024-02-01T12:34:56.789Z"
  },
  {
    "_id": "clubId2",
    "name": "Club 2",
    "description": "Description 2",
    "admin": {
      "_id": "adminId2",
      "fullName": "Admin 2",
      "username": "admin2"
    },
    "createdAt": "2024-02-01T12:45:00.000Z",
    "updatedAt": "2024-02-01T12:45:00.000Z"
  }
  // ... additional clubs
]
```

### 3. Fetch All Pending Club Join Requests

#### `GET /api/clubs/fetchAllPendingClubRequests`

Fetch all users who have sent requests to join the user's club (admin only).

**Response:**
```json
[
  {
    "_id": "userId1",
    "fullName": "User 1",
    "username": "user1",
    "email": "user1@example.com",
    "fieldOfStudy": "Field 1"
  },
  {
    "_id": "userId2",
    "fullName": "User 2",
    "username": "user2",
    "email": "user2@example.com",
    "fieldOfStudy": "Field 2"
  }
  // ... additional users
]
```

### 4. Fetch My Clubs

#### `GET /api/clubs/myClubs`

Fetch all clubs that the user is a member of.

**Response:**
```json
[
  {
    "_id": "clubId1",
    "name": "Club 1",
    "description": "Description 1",
    "profilePicture": "https://example.com/picture1.jpg",
    "admin": {
      "_id": "adminId1",
      "fullName": "Admin 1",
      "username": "admin1"
    },
    "createdAt": "2024-02-01T12:34:56.789Z",
    "updatedAt": "2024-02-01T12:34:56.789Z"
  },
  {
    "_id": "clubId2",
    "name": "Club 2",
    "description": "Description 2",
    "profilePicture": "https://example.com/picture2.jpg",
    "admin": {
      "_id": "adminId2",
      "fullName": "Admin 2",
      "username": "admin2"
    },
    "createdAt": "2024-02-01T12:45:00.000Z",
    "updatedAt": "2024-02-01T12:45:00.000Z"
  }
  // ... additional clubs
]
```

### 5. Fetch My Own Club (Admin Only)

#### `GET /api/clubs/myOwnClub`

Fetch the club for which the user is the admin.

**Response:**
```json
{
  "_id": "clubId",
  "name": "My Club",
  "description": "My Club Description",
  "profilePicture": "https://example.com/my-club-picture.jpg",
  "admin": {
    "_id": "adminId",
    "fullName": "Admin",
    "username": "admin"
  },
  "createdAt": "2024-02-01T13:00:00.000Z",
  "updatedAt": "2024-02-01T13:00:00.000Z"
}
```

### 6. Send Club Join Request

#### `GET /api/clubs/sendClubJoinRequest/:id`

Send a join request to a specific club.

**Response:**
```json
"Request sent successfully."
```

### 7. Accept Club Join Request (Admin Only)

#### `GET /api/clubs/acceptClubJoinRequest/:id`

Accept a join request for the user's club (admin only).

**Response:**
```json
"Request accepted successfully."
```


## Lost and Found API Documentation

### 1. Post Lost and Found Item

#### `POST /api/lost-and-found/post`

Post a lost and found item.

**Request:**
```json
{
  "title": "Item Title",
  "description": "Item Description",
  "picture": "https://example.com/item-picture.jpg"
}
```

**Response:**
```json
{
  "_id": "itemId",
  "title": "Item Title",
  "description": "Item Description",
  "picture": "https://example.com/item-picture.jpg",
  "createdAt": "2024-02-01T12:00:00.000Z",
  "updatedAt": "2024-02-01T12:00:00.000Z"
}
```

### 2. Fetch Lost and Found Items

#### `GET /api/lost-and-found`

Fetch all lost and found items.

**Response:**
```json
[
  {
    "_id": "itemId1",
    "title": "Item 1 Title",
    "description": "Item 1 Description",
    "picture": "https://example.com/item1-picture.jpg",
    "createdAt": "2024-02-01T12:30:00.000Z",
    "updatedAt": "2024-02-01T12:30:00.000Z"
  },
  {
    "_id": "itemId2",
    "title": "Item 2 Title",
    "description": "Item 2 Description",
    "picture": "https://example.com/item2-picture.jpg",
    "createdAt": "2024-02-01T13:00:00.000Z",
    "updatedAt": "2024-02-01T13:00:00.000Z"
  }
  // ... additional items
]
```

### 3. Update Lost and Found Item

#### `PUT /api/lost-and-found/update/:id`

Update a specific lost and found item (admin only).

**Request:**
```json
{
  "title": "Updated Item Title",
  "description": "Updated Item Description",
  "picture": "https://example.com/updated-item-picture.jpg"
}
```

**Response:**
```json
{
  "_id": "itemId",
  "title": "Updated Item Title",
  "description": "Updated Item Description",
  "picture": "https://example.com/updated-item-picture.jpg",
  "createdAt": "2024-02-01T12:00:00.000Z",
  "updatedAt": "2024-02-01T12:15:00.000Z"
}
```

### 4. Delete Lost and Found Item

#### `DELETE /api/lost-and-found/delete/:id`

Delete a specific lost and found item (admin only).

**Response:**
```json
{
  "message": "Lost and found item deleted"
}
```





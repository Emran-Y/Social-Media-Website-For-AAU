import React from "react";
import "./userMyOwnClub.css";
import LeftText from "../../textMessages/leftText/LeftText";
import RightText from "../../textMessages/rightText/RightText";
import { format } from "timeago.js";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5011");

function UserMyOwnClub() {
  const [myClubs, setMyClubs] = React.useState([]);
  const [msg, setMsg] = React.useState("");
  const [clickedChat, setClickedChat] = React.useState();
  const [lodded, setLodded] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [isRemoved, setIsRemoved] = React.useState("right");
  const [room, setRoom] = React.useState("");

  React.useEffect(() => {
    if (!room) return;
    socket.emit("join_room", room);
  }, [clickedChat]);

  React.useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("userData")).userId);
  }, [clickedChat]);

  React.useEffect(() => {
    console.log("called");

    const handleResize = () => {
      if (window.innerWidth < 1000 && clickedChat) {
        setIsRemoved("left");
      } else if (window.innerWidth < 1000 && !clickedChat) {
        setIsRemoved("right");
      } else {
        setIsRemoved("");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [clickedChat]); // You can choose to include clickedChat in the dependencies array if needed

  React.useEffect(() => {
    if (window.innerWidth < 1000 && clickedChat) {
      setIsRemoved("left");
    } else if (window.innerWidth < 1000 && !clickedChat) {
      setIsRemoved("right");
    } else {
      setIsRemoved("");
    }
  }, [clickedChat]);

  React.useEffect(() => {
    fetch("http://localhost:5011/api/club/myClubs/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLodded(true);
        setMyClubs(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  }, []);

  const typingHandler = (e) => {
    setMsg(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg) return;
    fetch("http://localhost:5011/api/message/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify({
        content: msg,
        clubId: clickedChat._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        socket.emit("send_message", { text: data, room });
        setMessages((prevMessages) => [...prevMessages, data]);
        setMsg("");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  };

  React.useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [socket]);
  const handleClubCardClicked = (club) => {
    console.log(club);
    console.log(JSON.parse(localStorage.getItem("userData")).userId);
    setClickedChat(club);
    fetch(`http://localhost:5011/api/message/fetchAllMessages/${club._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessages(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  };

  return (
    <div className="usermyown-chatting-container">
      <div
        className={`usermyown-chatting-container-left ${
          isRemoved == "left" ? "isRemoved" : ""
        }`}
      >
        <div className="usermyown-chatting-container-left-header">
          <h2 className="usermyown-chatting-container-left-header-title">
            My Chats
          </h2>
        </div>
        <div className="usermyown-chatting-container-left-main">
          {lodded ? (
            myClubs.length == 0 ? (
              <div className="clubadminpendings-card">
                <p
                  style={{ textAlign: "center" }}
                  className="clubadminpendings-username"
                >
                  No Clubs
                </p>
              </div>
            ) : (
              myClubs.map((club) => {
                return (
                  <div
                    onClick={() => {
                      handleClubCardClicked(club);
                      setRoom(club._id);
                    }}
                    className="usermyown-chatting-container-left-main-card"
                  >
                    <h2 className="usermyown-chatting-container-left-main-card-title">
                      {club.clubName}
                    </h2>
                    <p className="usermyown-chatting-container-left-main-card-message">
                      {" "}
                      <strong>{club.clubName}</strong>:{" "}
                      {club.latestMessage && club.latestMessage.message}
                    </p>
                  </div>
                );
              })
            )
          ) : (
            <div className="nice-spinner"></div>
          )}
        </div>
      </div>
      <div
        className={`usermyown-chatting-container-right ${
          isRemoved == "right" ? "isRemoved" : ""
        }`}
      >
        {clickedChat ? (
          <div className="component-wrapper">
            <div className="usermyown-chatting-container-right-header">
              <h2
                className="club-club-title-chat-user"
                onClick={() => setClickedChat(null)}
              >
                {clickedChat.clubName}
              </h2>
            </div>
            <div className="usermyown-chatting-container-right-below">
              <div className="usermyown-chatting-container-right-main">
                {messages.length > 0 && (
                  <>
                    {messages.map((msg) =>
                      JSON.parse(localStorage.getItem("userData")) &&
                      JSON.parse(localStorage.getItem("userData")).userId !==
                        msg.sender._id ? (
                        <LeftText
                          key={msg._id}
                          userId={msg.sender._id}
                          content={msg.content}
                          name={msg.sender.username}
                          pic={msg.sender.profilePicture}
                          time={format(msg.createdAt)}
                        />
                      ) : (
                        <RightText
                          key={msg._id}
                          content={msg.content}
                          name={
                            JSON.parse(localStorage.getItem("userData")) &&
                            JSON.parse(localStorage.getItem("userData"))
                              .fullName
                          }
                          time={format(msg.createdAt)}
                        />
                      )
                    )}
                  </>
                )}
              </div>
              <form
                className="usermyown-chatting-container-right-footer"
                onSubmit={(e) => handleSubmit(e)}
              >
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => typingHandler(e)}
                  className="msg-input"
                  placeholder="Send a message"
                />
                <button type="submit" className="send-btn">
                  send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="start-chat-container">
            <h1 className="start-chat">Click on a Club to Start Chatting</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserMyOwnClub;

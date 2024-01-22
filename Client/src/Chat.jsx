import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({socket, username, room}) {

    const [currentMsg, setCurrentMsg] = useState("")
    const [msgList, setMsglist] = useState([])

    const sendMessage = async ()=> {
        if(currentMsg!==""){
            const messageData = {
                room: room,
                author: username,
                message: currentMsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }
            await socket.emit("send_message", messageData)
            setMsglist((list) => [...list,messageData])
            setCurrentMsg("")
        }
    }

    useEffect(() => {
        socket.on("receive_message",(data) => {
            setMsglist((list) => [...list,data])
        })
    },[socket])

  return (
    <div className='chat-window'>
        <div className="chat-header">
            <p>Live Chat</p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className='message-container'>
                {msgList.map((messageContent) =>{
                    return (
                        <div className='message' id={username === messageContent.author?"you":"other"}>
                            <div>
                                <div className='message-content'>
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <p id='time'>{messageContent.time}</p>
                                    <p id='author'>{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
        <input
          type="text"
          value={currentMsg}
          placeholder="Send message..."
          onChange={(event) => {
            setCurrentMsg(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />

            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chat
import { useState, useEffect } from "react";
import Pusher from 'pusher-js';

type Message = {
  author: string;
  message: string;
};

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [chosenUsername, setChosenUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      userAuthentication: {
        endpoint:  '/pusher/user-auth',
        transport: 'ajax'
      }
    });

    const channel = pusher.subscribe('socketio_experimeents');

    channel.bind('newIncomingMessage', (msg: Message) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);
    });

    // Cleanup the subscription and unbind the event
    return () => {
      channel.unbind('newIncomingMessage');
      pusher.unsubscribe('socketio_experimeents');
    };
  }, []);

  const sendMessage = async () => {
    await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author: chosenUsername, message }),
    });

    setMessage("");
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };


  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <>
            <h3 className="font-bold text-white text-xl">
              How people should call you?
            </h3>
            <input
              type="text"
              placeholder="Identity..."
              value={username}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => {
                setChosenUsername(username);
              }}
              className="bg-white rounded-md px-4 py-2 text-xl"
            >
              Go!
            </button>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-xl">
              Your username: {username}
            </p>
            <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md bg-gray-300 ">
              <div className="h-full last:border-b-0 overflow-y-scroll no-scrollbar">
                {messages.map((msg, i) => {
                  return (
                    <div
                      className="w-full py-1 px-2 bg-gray-300"
                      key={i}
                    >
                      {msg.author} : {msg.message}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-300 w-full flex rounded-bl-md">
                <input
                  type="text"
                  placeholder="New message..."
                  value={message}
                  className="outline-none py-2 px-2 rounded-bl-md flex-1 bg-gray-300"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeypress}
                />
                <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
                  <button
                    className="group-hover:text-white px-3 h-full"
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
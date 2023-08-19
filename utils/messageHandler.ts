import { Server, Socket } from 'socket.io';

type Message = {
    author: string;
    message: string;
};

export default (io: Server, socket: Socket) => {
    const createdMessage = (msg: Message) => {
        socket.broadcast.emit("newIncomingMessage", msg);
    };

    socket.on("createdMessage", createdMessage);
};

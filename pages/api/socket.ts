import { Server, Socket as IOSocket } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import messageHandler from "../../utils/messageHandler";

interface ExtendedNetServer extends NetServer {
  io?: Server;
}

type SocketHandlerResponse = {
  socket: {
    server: ExtendedNetServer;
  };
} & NextApiResponse;

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  
  const response = res as SocketHandlerResponse;

  // It means that socket server was already initialised
  if (response.socket.server.io) {
    console.log("Already set up");
    response.end();
    return;
  }

  const io = new Server(response.socket.server);
  response.socket.server.io = io;

  const onConnection = (socket: IOSocket) => {
    messageHandler(io, socket);
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  response.end();
}

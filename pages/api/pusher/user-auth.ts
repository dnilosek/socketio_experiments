import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true
  });

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { socket_id, channel_name, username } = req.body;
  const randomString = Math.random().toString(36).slice(2);

  const user = {
    id: randomString,
    user_info: {
      name: username,
    }
  };

  // Here, you can implement additional logic to determine if the
  // current user is allowed to access the channel

  const auth = pusher.authenticateUser(socket_id, user);

  console.log(auth)
  res.send(auth);
};
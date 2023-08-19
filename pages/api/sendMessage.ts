import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true
});

export default async function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure it's a POST request
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { author, message } = req.body;

    // Trigger a new message event on your Pusher channel
    pusher.trigger('socketio_experimeents', 'newIncomingMessage', {
      author,
      message
    });

    return res.status(200).json({ success: true, message: "Message sent!" });

  } catch (error) {
    console.error("Error sending message: ", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}
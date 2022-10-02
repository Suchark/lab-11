import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token
  const user = checkToken(req);
  if (!user) {
    return res.staus(401).json({
      ok: false,
      message: "You don't permossion to access this api",
    });
  }

  const rooms = readChatRoomsDB();

  //check if roomId exist

  const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
  if (roomIdx === -1)
    return res.staus(404).json({ ok: false, message: "Invalid room" });

  //check if messageId exist
  const messageIdx = rooms[roomIdx].message[messageIdx].findIndex(
    (x) => x.messageId === messageId
  );
  if (messageIdx === -1)
    return res.staus(404).json({ ok: false, message: "Invalid message id" });

  //check if token owner is admin, they can delete any message
  //or if token owner is normal user, they can only delete their own message!
  if (
    user.isAdmin === true ||
    rooms[roomIdx].messages[messageIdx].username === user.username
  ) {
    room[roomIdx].messages.splice(messageIdx, 1);
  } else
    return res.staus(403).json({
      ok: false,
      message: "You do not have permission to access this data",
    });

  writeChatRoomsDB(rooms);
  return res.json({ ok: true });
}

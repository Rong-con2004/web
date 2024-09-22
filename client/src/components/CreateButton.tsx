import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const Join: React.FC = () => {
  const ws = useContext(RoomContext);
  const webS = ws.ws;
  const createRoom = () => {
    webS.emit("create-room");
    // console.log("Peers ", ws.peers);
    // console.log(typeof webS.emit);
  };
  return (
    <button
      onClick={createRoom}
      className="bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white"
    >
      Star new meeting
    </button>
  );
};

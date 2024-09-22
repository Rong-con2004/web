import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";

export const Room = () => {
  const { id } = useParams();
  const context = useContext(RoomContext);

  const ws = context.ws;
  const me = context.me;
  const stream = context.stream;
  const peers = context.peers;

  useEffect(() => {
    if (me && ws) ws.emit("join-room", { roomId: id, peerId: me._id });
  }, [id, me, ws]);

  return (
    <>
      Room id {id}
      <div className="grid grid-cols-4 gap-4">
        <VideoPlayer stream={stream} />

        {Object.values(peers as PeerState).map((peer, index) => (
          <VideoPlayer key={index} stream={peer.stream} />
        ))}
      </div>
    </>
  );
};

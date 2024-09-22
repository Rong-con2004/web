import Peer from "peerjs";
import { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});

  // Navigate to the room after it's created
  const enterRoom = (roomId: string) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };
  // Get the list of participants in the room
  const getUsers = (participants: string[]) => {
    console.log({ participants });
  };

  // Remove a peer from the list of participants
  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const meId = uuidv4();
    const peer = new Peer(meId);

    setMe(peer);
    // Request access to user's video and audio
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
    // Listen for events from the socket server
    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
  }, []);
  // Handle peer-to-peer communication
  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", (peerId: string) => {
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        console.log("Stream received from:", peerId);
        dispatch(addPeerAction(peerId, peerStream));
      });
    });
    // Answer incoming peer calls
    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  console.log("Current peers: ", { peers });

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

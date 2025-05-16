import { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useUserStore } from "../store/userStore";
import dayjs from "dayjs";

const ChatPage = () => {
  const { user, teams } = useUserStore();
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  useEffect(() => {
    if (!selectedTeam) return;

    const q = query(
      collection(db, "teams", selectedTeamId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [selectedTeamId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "teams", selectedTeamId, "messages"), {
      text: message,
      sender: user.displayName || "Anonymous",
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-zinc-900 text-white flex overflow-hidden">
      {/* Sidebar: Team Selector */}
      <div className="w-full sm:w-1/4 bg-zinc-800 border-r border-zinc-700 p-4">
        <h2 className="text-lg font-semibold mb-4">Teams</h2>
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {teams.map((team) => (
            <li
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`p-3 rounded cursor-pointer transition ${
                team.id === selectedTeamId
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-700 hover:bg-zinc-600 text-gray-200"
              }`}
            >
              {team.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col flex-1 h-full">
        {selectedTeam && (
          <>
            {/* Header */}
            <div className="flex items-center p-4 bg-zinc-800 border-b border-zinc-700">
              <button
                className="sm:hidden mr-2"
                onClick={() => setSelectedTeamId(null)}
              >
                <ChevronLeft />
              </button>
              <h3 className="text-lg font-semibold">{selectedTeam.name}</h3>
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-zinc-900">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isCurrentUser = msg.uid === user.uid;
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[75%] ${
                        isCurrentUser ? "ml-auto text-right" : "mr-auto"
                      }`}
                    >
                      <p className="text-xs text-gray-400 mb-1">
                        {msg.sender || "Anonymous"}
                      </p>
                      <div
                        className={`p-3 rounded-lg text-sm shadow ${
                          isCurrentUser
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700 text-white"
                        }`}
                      >
                        {msg.text}
                        <div className="text-[10px] mt-1 text-gray-300 text-right">
                          {msg.createdAt?.seconds
                            ? dayjs.unix(msg.createdAt.seconds).format("HH:mm")
                            : "Sending..."}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center italic">
                  No messages yet.
                </p>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Input Section */}
            <div className="p-4 border-t border-zinc-700 bg-zinc-800">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full p-2 rounded-md bg-zinc-700 text-white resize-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

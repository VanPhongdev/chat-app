import { useState, useEffect } from 'react';
import { roomApi } from '../api/room.api';
import Sidebar from '../components/chat/Sidebar';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import FriendSearch from '../components/chat/FriendSearch';
import FriendRequests from '../components/chat/FriendRequests';
import OnlineFriends from '../components/chat/OnlineFriends';

export default function ChatPage() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeNav, setActiveNav] = useState('chats');
  const [showFriendSearch, setShowFriendSearch] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [friendsRefresh, setFriendsRefresh] = useState(0);

  useEffect(() => {
    const loadRooms = async () => {
      setLoadingRooms(true);
      try {
        const { data } = await roomApi.getRooms();
        setRooms(data || []);
      } catch {
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRooms();
  }, []);

  const handleFriendSelect = async (friend) => {
    const existingRoom = rooms.find((room) =>
      room.type === 'direct' &&
      room.members?.some((member) => {
        const userId = member.user?._id ? member.user._id : member.user;
        return userId?.toString() === friend._id.toString();
      })
    );

    try {
      if (existingRoom) {
        const { data } = await roomApi.getRoomById(existingRoom._id);
        setActiveRoom(data);
        return;
      }

      const { data } = await roomApi.openDirectRoom(friend._id);
      setRooms((prev) => {
        const exists = prev.find((r) => r._id === data._id);
        return exists ? prev : [data, ...prev];
      });
      setActiveRoom(data);
    } catch (err) {
      console.error('Could not open direct chat:', err);
    }
  };

  const handleRoomSelect = async (room) => {
    try {
      const { data } = await roomApi.getRoomById(room._id);
      setActiveRoom(data);
    } catch {
      setActiveRoom(room);
    }
  };

  const handleMessageReceived = (msg, roomId) => {
    const createdAt = msg.createdAt || msg.created_at || msg.created_at || new Date().toISOString();
    setRooms((prev) => {
      const idx = prev.findIndex((r) => r._id === roomId);
      if (idx === -1) {
        const newRoom = {
          _id: roomId,
          name: msg.room_name || msg.room || 'Cuộc trò chuyện',
          avatar: '',
          type: 'direct',
          last_message: { content: msg.content, sender: msg.sender, created_at: createdAt },
        };
        return [newRoom, ...prev];
      }

      const room = prev[idx];
      const updated = { ...room, last_message: { content: msg.content, sender: msg.sender, created_at: createdAt } };
      const copy = prev.filter((r) => r._id !== roomId);
      return [updated, ...copy];
    });
  };

  const handleFriendsUpdated = () => {
    setFriendsRefresh(prev => prev + 1);
  };

  return (
    <>
      <title>Chat App</title>
      <div className="chat-layout">
        <Sidebar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          onFindFriends={() => setShowFriendSearch(true)}
          onViewRequests={() => setShowFriendRequests(true)}
        />

        {activeNav === 'chats' && (
          <>
            <ConversationList
              rooms={rooms}
              activeRoomId={activeRoom?._id}
              onSelect={handleRoomSelect}
              loading={loadingRooms}
            />

            <ChatWindow room={activeRoom} onMessageReceived={handleMessageReceived} />

            <OnlineFriends refreshTrigger={friendsRefresh} onSelectFriend={handleFriendSelect} />
          </>
        )}

        {showFriendSearch && (
          <FriendSearch onClose={() => setShowFriendSearch(false)} />
        )}

        {showFriendRequests && (
          <FriendRequests
            onClose={() => setShowFriendRequests(false)}
            onAccepted={handleFriendsUpdated}
          />
        )}
      </div>
    </>
  );
}

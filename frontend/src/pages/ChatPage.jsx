import React, { useEffect, useState } from "react";
import useUserAuth from "../hooks/useUserAuth";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { Link, Navigate, useParams } from "react-router-dom";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import { StreamChat } from "stream-chat";
import CallBtn from "../components/CallBtn";
import { ArrowLeft } from "lucide-react";

const ChatPage = () => {
  const { id } = useParams();
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useUserAuth();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: Boolean(authUser),
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullname,
            image: authUser.profilePic,
          },
          tokenData.token
        );
        const channelId=[authUser._id, id].sort().join("-");
        const channel = client.channel("messaging", channelId, {
          members: [authUser._id, id],
        });
        await channel.watch();
        setChatClient(client);
        setChannel(channel);

      } catch (error) {
        console.error("Error initializing chat:", error);
         toast.error("Error initializing chat");
      }
      finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, id]);


  const handleVideoCall = () => {
    if(channel){
      const callUrl=`${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text:`I have started a video call. Click the link to join: ${callUrl}`,
      })
      toast.success("Video call link sent");
    }
  }

  if (loading||!chatClient||!channel) return <ChatLoader />;


return (
  <div className="h-full overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2 bg-base-300 shadow">
      <Link
        to="/"
        className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
        title="Go Back"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </Link>
    
    </div>

    <Chat client={chatClient} theme="messaging light">
      <Channel channel={channel}>
        
        <div className="w-full relative">
           <CallBtn handleVideoCall={handleVideoCall} />
          <Window>
            
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
        </div>
        <Thread />
      </Channel>
    </Chat>
  </div>
);

};

export default ChatPage;

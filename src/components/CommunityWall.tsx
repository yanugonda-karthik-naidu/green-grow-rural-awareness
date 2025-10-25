import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ThumbsUp, Sprout } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  reactions: { [key: string]: number };
}

interface CommunityWallProps {
  t: any;
}

export const CommunityWall = ({ t }: CommunityWallProps) => {
  const [messages, setMessages] = useLocalStorage<Message[]>('communityMessages', []);
  const [newMessage, setNewMessage] = useState("");

  const postMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toLocaleString(),
      reactions: {}
    };

    setMessages([message, ...messages]);
    setNewMessage("");
    toast.success("Message posted! 📝");
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [emoji]: (msg.reactions[emoji] || 0) + 1
          }
        };
      }
      return msg;
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">{t.communityWall}</h2>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Share your plantation story..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={postMessage} className="w-full">
            <Sprout className="mr-2 h-4 w-4" />
            {t.shareProgress}
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {messages.slice(0, 10).map((message) => (
          <Card key={message.id} className="p-4 animate-slide-up">
            <p className="text-foreground mb-2">{message.text}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
              <div className="flex gap-2">
                {[
                  { emoji: '🌱', icon: Sprout },
                  { emoji: '❤️', icon: Heart },
                  { emoji: '👍', icon: ThumbsUp }
                ].map(({ emoji, icon: Icon }) => (
                  <Button
                    key={emoji}
                    size="sm"
                    variant="ghost"
                    onClick={() => addReaction(message.id, emoji)}
                    className="h-8 gap-1"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="text-xs">{message.reactions[emoji] || 0}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

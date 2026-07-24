import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Bot, User as UserIcon } from "lucide-react";

export type BotProfile = {
  name: string;
  role: string;
  intro: string;
  suggestions: string[];
  reply: (q: string) => string;
};

export function ChatBot({ profile }: { profile: BotProfile }) {
  const [messages, setMessages] = useState<
    Array<{ who: "bot" | "user"; text: string }>
  >([{ who: "bot", text: profile.intro }]);
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { who: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { who: "bot", text: profile.reply(q) }]);
    }, 450);
  }

  return (
    <Card className="flex h-[620px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-hero-gradient px-5 py-4 text-white">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <div className="font-display font-semibold">{profile.name}</div>
          <div className="text-xs opacity-80">{profile.role} · online</div>
        </div>
        <Sparkles className="ml-auto h-4 w-4 text-accent" />
      </div>

      <div
        ref={scroller}
        className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-5"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${m.who === "user" ? "justify-end" : ""}`}
          >
            {m.who === "bot" && (
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-white">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.who === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border"
              }`}
            >
              {m.text}
            </div>
            {m.who === "user" && (
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-primary">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-background px-5 py-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {profile.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-accent hover:bg-accent/5"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${profile.name}…`}
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

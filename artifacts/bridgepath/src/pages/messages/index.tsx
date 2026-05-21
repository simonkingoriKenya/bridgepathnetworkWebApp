import { Link } from "wouter";
import { Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TERRACOTTA = "#C04020";
const INK = "#1E1511";

const conversations = [
  { name: "Amina Mensah", role: "Senior Software Engineer", preview: "Thank you for reaching out. I’m available for an intro call this week.", time: "10:24" },
  { name: "Peter Rono", role: "Product Manager", preview: "I can share more detail on recent product launches and market expansion work.", time: "Yesterday" },
  { name: "Lydia Osei", role: "HR Operations Lead", preview: "Happy to discuss how I have managed HR operations for remote teams.", time: "Mon" },
];

export default function MessagesPage() {
  const active = conversations[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: TERRACOTTA }}>Employer Messages</p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: INK }}>Candidate Conversations</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">A simple V1 message area for employer-candidate conversations. Full real-time messaging can be connected after candidate onboarding is live.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search messages" />
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {conversations.map((conversation, index) => (
              <button key={conversation.name} className={`w-full text-left p-4 transition-colors ${index === 0 ? "bg-orange-50/60" : "hover:bg-gray-50"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{conversation.name}</p>
                    <p className="text-xs text-gray-500">{conversation.role}</p>
                  </div>
                  <span className="text-[11px] text-gray-400">{conversation.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{conversation.preview}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[520px]">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{active.name}</p>
              <p className="text-xs text-gray-500">{active.role}</p>
            </div>
            <Link href="/candidates" className="text-xs font-semibold" style={{ color: TERRACOTTA }}>View profiles</Link>
          </div>

          <div className="flex-1 p-5 space-y-4 bg-gray-50/60">
            <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-700">Thank you for reaching out. I’m available for an intro call this week.</p>
            </div>
            <div className="max-w-[75%] ml-auto rounded-2xl rounded-tr-sm p-4 text-white" style={{ backgroundColor: INK }}>
              <p className="text-sm">Great. We’re hiring for a senior engineering role supporting products in Ghana and Kenya. Could you share your availability?</p>
            </div>
            <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-700">Tuesday or Thursday afternoon works well. I can also send a short portfolio summary before the call.</p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-3">
            <Input placeholder="Write a message" />
            <Button className="text-white" style={{ backgroundColor: TERRACOTTA }}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

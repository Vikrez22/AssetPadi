export default function TypingIndicator() {
  return (
    <div className="flex items-center message-enter">
      <div className="bg-white border border-gray-100 rounded-tr-2xl rounded-b-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 min-h-[44px]">
        <div className="w-2 h-2 bg-brand-muted rounded-full dot-1" />
        <div className="w-2 h-2 bg-brand-muted rounded-full dot-2" />
        <div className="w-2 h-2 bg-brand-muted rounded-full dot-3" />
      </div>
    </div>
  );
}

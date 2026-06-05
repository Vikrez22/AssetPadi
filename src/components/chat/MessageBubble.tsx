import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

// Custom parser to format simple markdown-like elements such as bold and newlines
function formatMessageContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, lineIdx) => {
    // Check if line is a bullet point
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      return (
        <li key={lineIdx} className="ml-4 list-disc mb-1.5 text-slate-800">
          {parseBoldText(bulletMatch[1])}
        </li>
      );
    }

    return (
      <p key={lineIdx} className={line.trim() === '' ? 'h-2' : 'mb-2 last:mb-0 text-slate-800'}>
        {parseBoldText(line)}
      </p>
    );
  });
}

function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-brand-yellow">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex flex-col message-enter ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`px-5 py-3.5 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] text-[15px] sm:text-base leading-relaxed transition-all shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-brand-teal to-cyan-600 text-white rounded-2xl rounded-tr-sm border border-brand-teal/10'
            : 'bg-white border border-gray-200/80 text-slate-800 rounded-2xl rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-inherit">{formatMessageContent(message.content)}</div>
        )}
      </div>
      <span className="text-[10px] text-brand-muted mt-1 px-1">{timeStr}</span>
    </div>
  );
}

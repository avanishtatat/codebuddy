import { Send } from 'lucide-react'

const ChatInput = ({ value, onChange, onSend, isLoading, messagesUsed }) => {
  return (
    <div className='w-full bg-white shadow-lg border-t border-t-gray-100 flex flex-col items-center p-3'>
        <div className='w-full max-w-15/16 md:max-w-5/6 mx-auto flex items-center gap-4'>
            <textarea
                rows={1}
                className='flex-1 h-auto max-h-40 overflow-y-auto px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={messagesUsed >= 20 ? "Message limit reached for today. Please try again tomorrow." : "Ask a coding question..."}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    // Auto-resize the textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'; // Limit max height to 160px (10 rows)

                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                disabled={isLoading || messagesUsed >= 20}
            ></textarea>
            <button 
                className={`px-4 py-3 rounded-lg text-white cursor-pointer self-end ${isLoading || messagesUsed >= 20 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={onSend}
                disabled={isLoading || messagesUsed >= 20}
            >
                <Send size={18} />
            </button>
        </div>
        <p className="text-center text-gray-500 text-[13px] space-x-3 mt-2">CodeBuddy only answers coding questions · 20 messages/day</p>
    </div>
  )
}

export default ChatInput
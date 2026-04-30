import { useAuth } from "../context/AuthContext";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Loader } from "lucide-react";

const codeBuddyAvatar = () => {
    return <span className='bg-blue-100 text-blue-500 rounded-full w-8! h-8! px-2 flex items-center justify-center text-sm font-semibold'>CB</span>
}

const userAvatar = (name) => {
    const words = name.split(' ');
    const maxWords = Math.min(words.length, 2);
    const initials = words.slice(0, maxWords).map(word => word.charAt(0).toUpperCase()).join('');
    return <span className='bg-green-100 text-green-500 rounded-full w-8 h-8 px-2 flex items-center justify-center text-sm font-semibold order-1'>{initials}</span>
}

const components = {
    code({node, inline, className, children, ...props}){
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="text-[10px] md:text-sm rounded-lg max-w-full overflow-x-auto"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code className='bg-gray-100 px-1 rounded text-[12px] md:text-sm overflow-x-auto' {...props}>
                {children}
            </code>
        )
    }
}
const MessageBubble = ({ role, content, loading }) => {
    const { user } = useAuth();
  return (
    <div className={`${role === 'assistant' ? 'self-start' : 'self-end'} w-fit max-w-14/15 md:max-w-4/5 flex gap-3`}>
      {role === 'assistant' ? codeBuddyAvatar() : userAvatar(user?.name || 'User')}
      <div className={`w-fit overflow-x-auto px-4 py-2 rounded-xl ${role === 'assistant' ? 'bg-white text-black rounded-tl-none' : 'bg-blue-500 text-white rounded-tr-none'}`}>
        <ReactMarkdown components={components}>
          {content}
        </ReactMarkdown>
        {loading && role === 'assistant' && <div className="flex items-center"><Loader className="animate-spin inline-block [animation-duration:2000ms] mr-2" />Processing...</div>}
      </div>
    </div>
  )
}

export default MessageBubble
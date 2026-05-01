import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const MarkdownPre = ({ children }) => {
  return <>{children}</>;
};

export const MarkdownCode = ({ className, children, ...props }) => {
  const isBlock = /^language-/.test(className || '');

  if (isBlock) {
    const language = className.replace(/^language-/, '');
    return (
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="text-[10px] md:text-sm rounded-lg max-w-full overflow-x-auto"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className="bg-gray-100 px-1 rounded text-[12px] md:text-sm overflow-x-auto" {...props}>
      {children}
    </code>
  );
};


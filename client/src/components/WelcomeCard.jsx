import { useAuth } from '../context/AuthContext';

const WelcomeCard = ({ onChipClick }) => {
    const { user } = useAuth();
  return (
    <div className='bg-white rounded-xl shadow p-6 max-w-11/12 md:max-w-4/5 mx-auto mt-10'>
        <h2 className='text-xl font-bold mb-4 text-center'>Hi {user?.name}, welcome to CodeBuddy!👋</h2>
        <p className='text-gray-600 text-center mb-6'>Ask me anything about coding - I can debug, explain concepts, and write code for you.</p>
        <div className='flex flex-wrap justify-center gap-4'>
            {['Explain useEffect', 'Fix my forEach loop', 'What is async/await', 'Write a REST API route'].map((example, idx) => (
                <div key={idx} className='bg-slate-200 w-fit rounded-xl shadow px-4 py-1 mb-3 cursor-pointer hover:border hover:border-blue-500 hover:text-blue-500 transition' onClick={() => onChipClick(example)}>
                    {example}
                </div>
            ))}
        </div>
    </div>
  )
}

export default WelcomeCard
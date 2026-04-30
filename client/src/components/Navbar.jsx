import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { Menu, MessageCircleX } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({messagesUsed}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {logout} = useAuth();
  return (
    <nav className='h-16 flex items-center bg-white px-8 justify-between shadow-md border-b-gray-100'>
        <h1 className='text-2xl font-bold'>Code<span className='text-blue-500'>Buddy</span></h1>
        <div className='hidden md:flex items-center gap-6'>
            <p className='text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-2xl'>{messagesUsed} / 20 messages</p>
            <Link to='/history' className='bg-blue-100 text-sm text-blue-500 px-3 py-1 rounded-2xl cursor-pointer hover:bg-blue-200'>History</Link>
            <button className='border rounded px-3.5 py-1 cursor-pointer hover:bg-gray-100' onClick={() => logout()}>Logout</button>
        </div>
        <div className='md:hidden relative'>
            <Menu className='md:hidden cursor-pointer' onClick={() => setIsDialogOpen(true)} role='button'/>
            {isDialogOpen && (
                <>
                    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm z-10' onClick={() => setIsDialogOpen(false)}></div>
                    <div className='absolute right-0 top-10 bg-white rounded shadow-md p-4 z-20 flex flex-col gap-4 w-50'>
                        <MessageCircleX className='self-end cursor-pointer hover:transform hover:scale-110 transition-transform' onClick={() => setIsDialogOpen(false)} />
                        <p className='text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-2xl'>{messagesUsed} / 20 messages</p>
                        <Link to='/history' className='bg-blue-100 text-sm text-blue-500 px-3 py-1 rounded-2xl cursor-pointer hover:bg-blue-200' onClick={() => setIsDialogOpen(false)}>History</Link>
                        <button className='border rounded px-3.5 py-1 cursor-pointer hover:bg-gray-100' onClick={() => {logout(); setIsDialogOpen(false)}}>Logout</button>
                    </div>
                </>
            )}
        </div>
    </nav>
  )
}

export default Navbar
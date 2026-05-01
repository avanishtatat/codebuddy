import { ArrowLeft, ArrowRight } from "lucide-react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className=" bg-transparent flex gap-4 justify-center py-6 items-center">
        <button className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border border-gray-300 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
            <ArrowLeft size={16} />
            <span className="hidden md:inline">Previous</span>
        </button>
        <span className="text-sm md:text-md text-gray-400">Page {currentPage} of {totalPages}</span>
        <button className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border border-gray-300 ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
            <span className="hidden md:inline">Next</span>
            <ArrowRight size={16} />
        </button>
    </div>
  )
}

export default Pagination
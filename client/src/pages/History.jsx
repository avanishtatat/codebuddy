import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "../utils/reactMarkdownHelper";
import Pagination from "../components/Pagination";
import { groupedByDates } from "../utils/dateHelper";

const History = () => {
  const [pairs, setPairs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openIndex, setOpenIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/chat/questions?page=${currentPage}`,
        );
        const {
          pairs: fetchedPairs,
          currentPage: fetchedCurrentPage,
          totalPages: fetchedTotalPages,
        } = response.data;
        setPairs(groupedByDates(fetchedPairs));
        setCurrentPage(fetchedCurrentPage);
        setTotalPages(fetchedTotalPages);
        setError("");
      } catch (err) {
        setError(err?.message || "Failed to fetch questions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [currentPage]);

  return (
    <div className="bg-gray-100 h-screen w-full">
      <nav className="h-16 flex items-center bg-white px-8 justify-between shadow-md border-b-gray-100 z-10">
        <Link to="/">
          <h1 className="text-2xl font-bold">
            Code<span className="text-blue-500">Buddy</span>
          </h1>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1 md:gap-2 cursor-pointer text-[11px] md:text-sm bg-blue-100 text-blue-500 px-2 md:px-3 py-1 rounded-2xl hover:bg-blue-200"
        >
          <ArrowLeft size={16} />
          Back to Chat
        </Link>
      </nav>
      <div className="h-[calc(100%-64px)] flex flex-col w-full overflow-y-auto">
        <div className="w-15/16 md:w-5/6 mx-auto p-4 h-full">
          <h1 className="text-[26px] font-semibold space-x-2">Chat History</h1>
          <p className="text-[14px] text-gray-500 space-x-4">
            All your past coding questions
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <Loader className="animate-spin" size={28} />
                <p className="text-sm">Loading your chat history...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <div>
                {/* Render chat history here */}
                {Object.keys(pairs).length === 0 ? (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-sm text-gray-500">
                      You haven't asked any questions yet.
                    </p>
                  </div>
                ) : (
                  Object.keys(pairs).map((date, index) => (
                    <div key={index} className="mt-6">
                      <h2 className="text-[13px] text-gray-400 mb-2 uppercase font-semibold">
                        {date}
                      </h2>
                      <div className="flex flex-col gap-4 overflow-y-auto">
                        {pairs[date].map((pair, idx) => (
                          <div
                            key={`${date}-${idx}`}
                            onClick={() =>
                              setOpenIndex(
                                openIndex === `${date}-${idx}`
                                  ? null
                                  : `${date}-${idx}`,
                              )
                            }
                            className="shadow rounded-xl bg-gray-100 border border-gray-200"
                          >
                            <div
                              className={`px-4 py-3 bg-white flex items-center justify-between ${openIndex === `${date}-${idx}` ? "rounded-t-xl border-b border-b-gray-200" : "rounded-xl"} cursor-pointer`}
                            >
                              <p className="text-sm md:text-[16px] font-medium mt-1">
                                <span className="h-8 w-8 rounded-full text-blue-400 bg-blue-100 px-3 py-1.5 mr-2">
                                  ?
                                </span>
                                {pair.question}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">
                                  {date === "Today"
                                    ? new Date(
                                        pair.createdAt,
                                      ).toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : new Date(
                                        pair.createdAt,
                                      ).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                </p>
                                {openIndex === `${date}-${idx}` ? (
                                  <ChevronUp
                                    size={16}
                                    className="text-gray-400 font-medium"
                                  />
                                ) : (
                                  <ChevronDown
                                    size={16}
                                    className="text-gray-400 font-medium"
                                  />
                                )}
                              </div>
                            </div>
                            {openIndex === `${date}-${idx}` && (
                              <div className="bg-transparent max-h-80 overflow-y-auto rounded-b-lg p-4 mt-2 border border-gray-100">
                                <ReactMarkdown components={markdownComponents}>
                                  {pair.answer}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;

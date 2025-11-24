import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavbar";
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

export default function PublicForum() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/forum/threads");
        setThreads(res.data.threads || []);
      } catch (err) {
        console.error("Error fetching threads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const handleNewThread = () => navigate("/new-thread");

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      <section className="relative mb-10 text-center">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-audiowide mb-1">
            Public Forum
          </h1>
          <p className="text-gray-300">
            Join discussions and share knowledge with the community
          </p>
        </div>
      </section>

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-audiowide tracking-wider">
          Latest Discussions
        </h2>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-4 lg:col-span-1">
            <div
              className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 mb-6`}
            >
              <h2 className="text-xl font-audiowide tracking-wider mb-4">
                Forum Categories
              </h2>

              <button
                onClick={handleNewThread}
                className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-6 shadow-md hover:brightness-110 ${ACCENT_GRADIENT}`}
              >
                Start New Thread
              </button>
            </div>
          </div>

          {/* Discussions */}
          <div className="col-span-4 lg:col-span-3">
            <div
              className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6`}
            >
              {loading ? (
                <p className="text-center text-gray-400">Loading discussions...</p>
              ) : threads.length === 0 ? (
                <p className="text-center text-gray-400">No threads yet.</p>
              ) : (
                <div className="space-y-4">
                  {threads.map((t) => (
                    <div
                      key={t._id}
                      className={`${BACKGROUND_COLOR} ${BORDER_COLOR} border rounded-xl p-6 hover:border-cyan-400/60 transition-colors duration-200`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-2">
                            {t.tags?.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full text-sm font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-600/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3
                            className="text-lg font-semibold text-white mb-3 hover:text-cyan-300 cursor-pointer transition-colors duration-200"
                            onClick={() => navigate(`/thread/${t._id}`)}
                          >
                            {t.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {t.body}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                            <div>👤 {t.authorName}</div>
                            <div>🏢 {t.companyName}</div>
                            <div>🕒 {new Date(t.createdAt).toLocaleString()}</div>
                            <div>💬 {t.comments?.length || 0} replies</div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/thread/${t._id}`)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200 whitespace-nowrap shadow-md"
                        >
                          Join Discussion
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

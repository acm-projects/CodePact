import { FiMessageSquare, FiEye, FiClock } from "react-icons/fi";
import { BACKGROUND_COLOR, BORDER_COLOR } from "../../utils/constants";

export default function DiscussionCard({ discussion, categoryStyles, onJoin }) {
  return (
    <div
      className={`${BACKGROUND_COLOR} ${BORDER_COLOR} border rounded-xl p-6 hover:border-cyan-400/60 transition-colors duration-200`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="mb-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                categoryStyles[discussion.category]?.badge ||
                "bg-cyan-500/15 text-cyan-300 border-cyan-600/30"
              }`}
            >
              {discussion.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-3 hover:text-cyan-300 cursor-pointer transition-colors duration-200">
            {discussion.title}
          </h3>

          {discussion.image && (
            <img
              src={discussion.image}
              alt="attachment"
              className="rounded-lg border border-gray-700 mb-4 max-h-64 object-cover"
            />
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <FiMessageSquare className="text-base" />
              <span>{discussion.replies} replies</span>
            </div>
            <div className="flex items-center gap-1">
              <FiEye className="text-base" />
              <span>{discussion.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="text-base" />
              <span>Last action {discussion.lastAction}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onJoin(discussion)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200 whitespace-nowrap shadow-md"
        >
          Join Discussion
        </button>
      </div>
    </div>
  );
}

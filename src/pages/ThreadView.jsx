import { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";
import {
  FiMessageSquare,
  FiArrowLeft,
  FiCornerDownRight,
} from "react-icons/fi";

// ReplyItem moved OUTSIDE ThreadView so it doesn't remount on each keystroke
function ReplyItem({
  reply,
  path,
  depth = 0,
  openReplyPath,
  setOpenReplyPath,
  inlineDraft,
  setInlineDraft,
  handleInlineReplySubmit,
}) {
  const isOpen = openReplyPath === path;

  return (
    <div className="space-y-3">
      <div
        className={`${BACKGROUND_COLOR} ${BORDER_COLOR} border rounded-xl p-4`}
        style={{ marginLeft: depth * 18 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-300 font-semibold text-sm">
            {reply.author}
          </span>
          <span className="text-gray-500 text-xs">{reply.time}</span>
        </div>

        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
          {reply.text}
        </p>

        {/* Reply-to-reply button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              setOpenReplyPath((prev) => (prev === path ? null : path));
              setInlineDraft("");
            }}
            className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
          >
            <FiCornerDownRight />
            Reply
          </button>
        </div>

        {/* Inline reply box */}
        {isOpen && (
          <div className="mt-3">
            <textarea
              rows="2"
              className="w-full mt-1 p-3 rounded-lg bg-slate-900/60 border border-gray-600 text-white text-sm"
              placeholder={`Reply to ${reply.author}...`}
              value={inlineDraft}
              onChange={(e) => setInlineDraft(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleInlineReplySubmit(reply.author)}
                className={`px-4 py-1.5 rounded-lg text-white text-sm font-semibold ${ACCENT_GRADIENT} hover:brightness-110`}
              >
                Post Reply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Children */}
      {reply.children?.length > 0 && (
        <div className="space-y-3">
          {reply.children.map((child, i) => (
            <ReplyItem
              key={`${path}.${i}`}
              reply={child}
              path={`${path}.${i}`}
              depth={depth + 1}
              openReplyPath={openReplyPath}
              setOpenReplyPath={setOpenReplyPath}
              inlineDraft={inlineDraft}
              setInlineDraft={setInlineDraft}
              handleInlineReplySubmit={handleInlineReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ThreadView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedThread = location.state?.thread;

  const fallbackThreads = useMemo(
    () => [...(passedThread ? [passedThread] : [])],
    [passedThread]
  );

  const thread = passedThread || fallbackThreads.find((t) => t.id === id);

  const normalizeReplies = (arr = []) =>
    arr.map((r) => ({
      author: r.author,
      text: r.text,
      time: r.time,
      children: r.children ? normalizeReplies(r.children) : [],
    }));

  const [replies, setReplies] = useState(
    normalizeReplies(thread?.threadReplies || [])
  );

  const [replyText, setReplyText] = useState("");

  // inline reply-to-reply state
  const [openReplyPath, setOpenReplyPath] = useState(null);
  const [inlineDraft, setInlineDraft] = useState("");

  if (!thread) {
    return (
      <div className={`min-h-screen ${BACKGROUND_COLOR} text-white`}>
        <GridOverlay />
        <LoggedInNavbar />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div
            className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6`}
          >
            Thread not found.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePostReply = () => {
    const text = replyText.trim();
    if (!text) return;

    const newReply = {
      author: "You",
      text,
      time: "Just now",
      children: [],
    };

    setReplies((prev) => [...prev, newReply]);
    setReplyText("");
  };

  const handleInlineReplySubmit = (replyAuthor) => {
    const text = inlineDraft.trim();
    if (!text || openReplyPath == null) return;

    const childReply = {
      author: "You",
      text: `@${replyAuthor} ${text}`,
      time: "Just now",
      children: [],
    };

    setReplies((prev) => {
      const indices = openReplyPath.split(".").map(Number);

      const clone = (list) =>
        list.map((x) => ({ ...x, children: [...x.children] }));
      const newReplies = clone(prev);

      let cursor = newReplies;
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        if (!cursor[idx]) return prev;

        if (i === indices.length - 1) {
          cursor[idx].children = [...cursor[idx].children, childReply];
        } else {
          cursor[idx].children = clone(cursor[idx].children);
          cursor = cursor[idx].children;
        }
      }

      return newReplies;
    });

    setInlineDraft("");
    setOpenReplyPath(null);
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/* Header */}
      <section className="relative mb-8 text-center">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />

        {/* Back button pinned to VERY left */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 md:left-6 top-6 md:top-8 flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 z-20"
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-audiowide">
            {thread.title}
          </h1>
          <p className="text-gray-400 mt-2">{thread.category}</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 pb-12 relative z-10 space-y-6">
        {/* Original post */}
        <div
          className={`${FEATURE_BG} ${BORDER_COLOR} border-2 rounded-2xl p-8 shadow-xl ring-2 ring-cyan-400/40 bg-gradient-to-br from-slate-900/70 to-slate-800/50`}
        >
          <div className="text-sm text-gray-400 mb-2 tracking-wide">
            Original Post
          </div>
          <p className="text-gray-100 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
            {thread.body || "No thread content yet."}
          </p>

          {thread.image && (
            <img
              src={thread.image}
              alt="thread attachment"
              className="mt-5 rounded-lg border border-gray-700 max-h-96 object-cover w-full"
            />
          )}
        </div>

        {/* Replies */}
        <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <FiMessageSquare className="text-lg text-cyan-300" />
            <h2 className="text-lg font-audiowide tracking-wide">
              Replies ({replies.length})
            </h2>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {replies.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No replies yet. Be the first!
              </p>
            ) : (
              replies.map((r, i) => (
                <ReplyItem
                  key={i}
                  reply={r}
                  path={`${i}`}
                  depth={0}
                  openReplyPath={openReplyPath}
                  setOpenReplyPath={setOpenReplyPath}
                  inlineDraft={inlineDraft}
                  setInlineDraft={setInlineDraft}
                  handleInlineReplySubmit={handleInlineReplySubmit}
                />
              ))
            )}
          </div>

          {/* Main reply composer */}
          <div className="mt-6">
            <label className="text-gray-300 text-sm font-semibold">
              Add a reply
            </label>
            <textarea
              rows="3"
              className="w-full mt-2 p-3 rounded-lg bg-slate-900/60 border border-gray-600 text-white"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handlePostReply}
                className={`px-5 py-2 rounded-lg text-white font-semibold ${ACCENT_GRADIENT} hover:brightness-110`}
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

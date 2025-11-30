
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
} from "../../utils/constants";
import { FiPaperclip } from "react-icons/fi";

export default function ThreadModal({ isOpen, onClose, onSubmit, categories }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(categories[0]?.value || "");
  const [image, setImage] = useState(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/60 backdrop-blur-sm transition"
    >
      <div
        className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-8 w-full max-w-xl shadow-2xl animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-audiowide mb-6 tracking-wide text-center text-cyan-300">
          Create New Thread
        </h2>

        <label className="text-gray-300 text-sm font-semibold">Category</label>
        <select
          className="w-full mt-1 mb-4 p-3 rounded-lg bg-slate-900/60 border border-gray-600 text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <label className="text-gray-300 text-sm font-semibold">
          Attach Image
        </label>
        <label
          htmlFor="thread-image-upload"
          className="w-full mb-4 mt-1 p-3 rounded-lg bg-slate-900/60 border border-gray-600 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition"
        >
          <input
            id="thread-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <div className="flex items-center gap-2 text-gray-300">
            <FiPaperclip className="text-lg" />
            <span>Add Image</span>
          </div>
          <span className="text-gray-500 text-sm">
            {image ? image.name : "Optional"}
          </span>
        </label>

        <label className="text-gray-300 text-sm font-semibold">Title</label>
        <input
          className="w-full mt-1 mb-4 p-3 rounded-lg bg-slate-900/60 border border-gray-600 text-white"
          placeholder="Thread title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="text-gray-300 text-sm font-semibold">Message</label>
        <textarea
          rows="5"
          className="w-full mt-1 mb-6 p-3 rounded-lg bg-slate-900/60 border border-gray-600 text-white"
          placeholder="Write your discussion..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ category, title, body, image })}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${ACCENT_GRADIENT} hover:brightness-110`}
          >
            Post Thread
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

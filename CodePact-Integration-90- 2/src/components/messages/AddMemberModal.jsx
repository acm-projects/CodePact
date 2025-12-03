import { useState } from "react";

export default function AddMemberModal({ conversationId, onClose, onAdded }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/conversations/${conversationId}/add-member`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("User added!");
        onAdded();
        onClose();
      } else {
        alert("Error adding member: " + (data.error || "unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] p-6 rounded-xl w-80 text-white border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Add Member</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@example.com"
          className="w-full bg-[#0f0f23] px-3 py-2 border border-gray-600 rounded-md text-white mb-3"
        />

        <button
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md text-sm font-semibold"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Member"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-400 hover:text-gray-200 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

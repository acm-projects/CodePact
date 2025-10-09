export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
    >
      {children}
    </button>
  );
}

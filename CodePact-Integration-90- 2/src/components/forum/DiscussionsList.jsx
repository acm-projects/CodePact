import DiscussionCard from "./DiscussionCard";

export default function DiscussionsList({
  discussions,
  categoryStyles,
  hasMore,
  onLoadMore,
  onJoinDiscussion,
}) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion, index) => (
        <DiscussionCard
          key={discussion.id || index}
          discussion={discussion}
          categoryStyles={categoryStyles}
          onJoin={onJoinDiscussion}
        />
      ))}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            className={`border hover:border-cyan-400/60 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200`}
          >
            Load More Discussions
          </button>
        </div>
      )}
    </div>
  );
}
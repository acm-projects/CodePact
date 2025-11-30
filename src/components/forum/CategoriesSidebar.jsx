import CategoryCard from "./CategoryCard";
import {
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
} from "../../utils/constants";

export default function CategoriesSidebar({
  categories,
  categoryStyles,
  selectedCategories,
  toggleCategory,
  onOpenModal,
}) {
  return (
    <div
      className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 mb-6`}
    >
      <h2 className="text-xl font-audiowide tracking-wider mb-4">
        Forum Categories
      </h2>

      <button
        onClick={onOpenModal}
        className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-6 shadow-md hover:brightness-110 ${ACCENT_GRADIENT}`}
      >
        Start New Thread
      </button>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Sections</h3>

        <div className="space-y-2">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.label}
              cat={cat}
              isActive={selectedCategories.includes(cat.value)}
              onToggle={toggleCategory}
              styles={categoryStyles}
            />
          ))}
        </div>

        {selectedCategories.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Click an active category again to remove it.
          </p>
        )}
      </div>
    </div>
  );
}
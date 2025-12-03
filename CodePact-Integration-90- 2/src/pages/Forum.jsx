import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

import ThreadModal from "../components/forum/ThreadModal";
import CategoriesSidebar from "../components/forum/CategoriesSidebar.jsx";
import DiscussionsList from "../components/forum/DiscussionsList.jsx";

export default function PublicForum() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // 10 fake discussions for Load More testing
  const [discussions, setDiscussions] = useState([
    {
      id: "t1",
      category: "Interview Advice",
      title:
        "How to counter-offer a lowball compensation package for Staff SWE?",
      replies: "25",
      views: "1.2k",
      lastAction: "2 hours ago by Janedoe",
      body: "I recently received an offer for Staff SWE, but the compensation feels lower than expected. What's the best way to counter without burning bridges?",
      threadReplies: [
        {
          author: "SeniorDev",
          text: "Ask for their comp bands and justify with market data + impact.",
          time: "1 hour ago",
        },
        {
          author: "HiringMgr",
          text: "Be direct but respectful. Focus on value, not emotion.",
          time: "45 minutes ago",
        },
      ],
    },
    {
      id: "t2",
      category: "Coding Questions",
      title: "Best explanation for the difference between 'map' and 'forEach'?",
      replies: "12",
      views: "4.0k",
      lastAction: "60 minutes ago by CodeMaster",
      body: "I keep mixing these up in interviews. Can someone explain the difference clearly with use cases?",
      threadReplies: [
        {
          author: "JSNinja",
          text: "`map` returns a new array, `forEach` does not. Use map for transforms.",
          time: "30 minutes ago",
        },
      ],
    },
    {
      id: "t3",
      category: "Success Stories",
      title: "[SUCCESS] My top 3 secrets for passing the ATS scan.",
      replies: "48",
      views: "2.8k",
      lastAction: "3 hours ago by John Smith",
      body: "After failing ATS screens for months, here are the three changes that finally worked for me...",
      threadReplies: [
        {
          author: "ResumePro",
          text: "Nice tips — especially the keyword mirroring.",
          time: "2 hours ago",
        },
      ],
    },
    {
      id: "t4",
      category: "Resume Review",
      title: "Can someone review my resume before I apply to Meta?",
      replies: "9",
      views: "980",
      lastAction: "1 hour ago by TechGuru",
      body: "Would love feedback on my bullet structure and project ordering.",
      threadReplies: [],
    },
    {
      id: "t5",
      category: "Coding Questions",
      title: "Why is my dynamic programming solution still timing out?",
      replies: "17",
      views: "3.2k",
      lastAction: "45 minutes ago by AlgorithmAce",
      body: "I optimized with memoization but still hitting TLE on LeetCode. What should I check?",
      threadReplies: [],
    },
    {
      id: "t6",
      category: "Interview Advice",
      title:
        "What’s the best way to prep for system design when short on time?",
      replies: "33",
      views: "5.4k",
      lastAction: "30 minutes ago by ArchitectPro",
      body: "Have a week before interviews. How do I maximize prep efficiently?",
      threadReplies: [],
    },
    {
      id: "t7",
      category: "Success Stories",
      title: "Landing my first internship after 200 applications — what worked",
      replies: "21",
      views: "1.7k",
      lastAction: "20 minutes ago by NewGradWin",
      body: "Posting what finally got me through after a long grind.",
      threadReplies: [],
    },
    {
      id: "t8",
      category: "Resume Review",
      title:
        "Portfolio feedback: does this project section feel strong enough?",
      replies: "6",
      views: "640",
      lastAction: "10 minutes ago by DesignDev",
      body: "Mainly unsure if I’m explaining impact well enough.",
      threadReplies: [],
    },
    {
      id: "t9",
      category: "Coding Questions",
      title: "How should I think about time complexity for nested recursion?",
      replies: "14",
      views: "2.1k",
      lastAction: "5 minutes ago by BigOBrain",
      body: "I get lost when recursion stacks multiple times. Any framework to analyze?",
      threadReplies: [],
    },
    {
      id: "t10",
      category: "Interview Advice",
      title: "How do you answer 'Tell me about yourself' without rambling?",
      replies: "19",
      views: "2.9k",
      lastAction: "12 minutes ago by StoryCrafter",
      body: "I know to keep it structured, but I always go too long. Any templates?",
      threadReplies: [],
    },
  ]);

  const categories = [
    {
      label: "Coding Questions",
      value: "Coding Questions",
      description: "Get help with code, algorithms, and CS concepts.",
    },
    {
      label: "Interview Advice",
      value: "Interview Advice",
      description: "Ask about interview prep, behavioral answers, or strategy.",
    },
    {
      label: "Resume Review",
      value: "Resume Review",
      description: "Share your resume for feedback and improvement.",
    },
    {
      label: "Success Stories",
      value: "Success Stories",
      description: "Read and share wins, milestones, and progress.",
    },
  ];

  const categoryStyles = {
    "Coding Questions": {
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-600/30",
      label: "text-emerald-300",
    },
    "Interview Advice": {
      badge: "bg-violet-500/15 text-violet-300 border-violet-600/30",
      label: "text-violet-300",
    },
    "Resume Review": {
      badge: "bg-amber-500/15 text-amber-300 border-amber-600/30",
      label: "text-amber-300",
    },
    "Success Stories": {
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-600/30",
      label: "text-cyan-300",
    },
  };

  const toggleCategory = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const filteredDiscussions =
    selectedCategories.length > 0
      ? discussions.filter((d) => selectedCategories.includes(d.category))
      : discussions;

  // -------------------------------
  // Load More Pagination
  // -------------------------------
  const PAGE_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategories.join("|")]);

  const displayedDiscussions = useMemo(
    () => filteredDiscussions.slice(0, visibleCount),
    [filteredDiscussions, visibleCount]
  );

  const hasMore = visibleCount < filteredDiscussions.length;

  const handleLoadMore = () => {
    if (!hasMore) return;
    setVisibleCount((prev) =>
      Math.min(prev + PAGE_SIZE, filteredDiscussions.length)
    );
  };

  const handleNewThreadSubmit = ({ category, title, body, image }) => {
    const newThread = {
      id: `t${Date.now()}`,
      category,
      title,
      replies: "0",
      views: "0",
      lastAction: "Just now",
      image: image ? URL.createObjectURL(image) : null,
      body,
      threadReplies: [],
    };
    setDiscussions((prev) => [newThread, ...prev]);
    setModalOpen(false);
    setVisibleCount((prev) => Math.max(prev, PAGE_SIZE));
  };

  const handleJoinDiscussion = (discussion) => {
    navigate(`/public-forum/thread/${discussion.id}`, {
      state: { thread: discussion },
    });
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/* Header */}
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
            <CategoriesSidebar
              categories={categories}
              categoryStyles={categoryStyles}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              onOpenModal={() => setModalOpen(true)}
            />
          </div>

          {/* Discussions */}
          <div className="col-span-4 lg:col-span-3">
            <div
              className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6`}
            >
              <h2 className="sr-only">Latest Discussions</h2>

              <DiscussionsList
                discussions={displayedDiscussions}
                categoryStyles={categoryStyles}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onJoinDiscussion={handleJoinDiscussion}
              />
            </div>
          </div>
        </div>
      </main>

      <ThreadModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewThreadSubmit}
        categories={categories}
      />

      <Footer />
    </div>
  );
}
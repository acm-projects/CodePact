import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav/NavBar";
import Footer from "../components/Footer";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Collaborative
              <br />
              <span className="text-white">Job Hunt</span> Starts Here.
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              CodePact transforms the isolated tech job hunt into a
              collaborative, team-oriented experience. Form squads with friends,
              share resources, and provide feedback to stay motivated and
              succeed together.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg">
              Create Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border border-gray-600 hover:border-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
            >
              Login
            </button>
          </div>

          {/* Divider Line */}
          <div className="border-t border-gray-700 max-w-2xl mx-auto"></div>
        </div>

        {/* Features Section with Colored Background */}
        <div className="bg-[#04021B] rounded-2xl p-12 -mx-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white-400">
              Features Built for Success
            </h2>
            <p className="text-lg text-white-400">
              Everything your squad needs to land the job.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "👥",
                title: "Form Squads",
                description:
                  "Team up with friends to create your job-hunting squad. Tackle challenges, share wins, and stay accountable throughout the process.",
              },
              {
                icon: "📚",
                title: "Shared Resources",
                description:
                  "Access a curated library of coding problems, interview guides, and resume templates. Build your collective knowledge base.",
              },
              {
                icon: "🏆",
                title: "Live Feeds & Leaderboards",
                description:
                  "Stay motivated with real-time squad updates and application leaderboards. Celebrate every win together.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#0f0f23] border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-colors duration-300"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

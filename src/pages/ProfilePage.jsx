import LoggedInNavbar from "../components/nav/LoggedInNavbar.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import DetailsCard from "../components/profile/DetailsCard.jsx";
import Footer from "../components/Footer.jsx";

export default function ProfilePage() {
  const profile = {
    name: "John Smith",
    handle: "johndev",
    email: "john.smith@example.com",
    location: "San Francisco, CA",
    skills: ["Problem Solving", "Creativity", "Leadership", "React.js"],
    bio: "Full-stack developer with a passion for intuitive UX, scalable web apps, and collaboration across diverse teams.",
    avatar: "",
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <LoggedInNavbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <ProfileHeader profile={profile} />
        <DetailsCard profile={profile} />
      </main>
      <Footer />
    </div>
  );
}

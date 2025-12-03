export default function ProfileHeader({ profile }) {
  return (
    <div className="rounded-2xl bg-[#0c123a] p-10 shadow-lg border border-[#1a214b]">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Left: avatar + name/handle */}
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-[#1b2356] border border-[#1a214b] overflow-hidden">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={`${profile.name} avatar`}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white leading-tight">
              {profile?.name || "Your Name"}
            </h1>
            <p className="text-[#a9b0d0] text-lg">
              @{profile?.handle || "handle"}
            </p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex gap-4">
          <button className="rounded-xl border border-[#1a214b] px-6 py-3 hover:bg-[#0f153f] text-sm md:text-base">
            Update Account
          </button>
          <button className="rounded-xl bg-[#3b82f6] px-6 py-3 font-medium text-white hover:opacity-90 text-sm md:text-base">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

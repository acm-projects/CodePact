function Detail({ label, value }) {
  return (
    <div className="space-y-2">
      <div className="text-base font-semibold text-white">{label}</div>
      <div className="text-[#a9b0d0] text-lg">{value || "—"}</div>
    </div>
  );
}

export default function DetailsCard({ profile }) {
  return (
    <div className="rounded-2xl border border-[#1a214b] bg-[#0b1034] p-10 shadow-lg mt-10 text-white">
      <h2 className="mb-8 text-2xl font-semibold">My Details</h2>

      <div className="grid gap-8 md:grid-cols-2">
        <Detail label="Name" value={profile?.name} />
        <Detail label="Email" value={profile?.email} />
        <Detail label="Location" value={profile?.location} />
        <Detail label="Skills" value={profile?.skills?.join(", ")} />
      </div>

      <div className="mt-12">
        <div className="text-base font-semibold">Bio:</div>
        <p className="mt-2 leading-relaxed text-[#a9b0d0] text-lg">
          {profile?.bio ||
            "Tell people about your experience, interests, and goals."}
        </p>
      </div>
    </div>
  );
}

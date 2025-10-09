import Button from "../components/Button.jsx"; 

export default function GroupCreation() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Create or Join a Squad</h1>
      
      {/* Use your Button here */}
      <Button>Join Squad</Button>
      <Button>Create Squad</Button>
    </div>
  );
}

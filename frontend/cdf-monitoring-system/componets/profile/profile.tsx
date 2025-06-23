"use client"; 
import { useState } from 'react';

const ProfilePage = () => {
  // Example state for form
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');

interface ProfileFormEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = (e: ProfileFormEvent): void => {
    e.preventDefault();
    alert(`Profile updated:\nName: ${name}\nEmail: ${email}`);
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left card - Profile info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Info</h2>
          <div className="flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="User Avatar"
              className="w-24 h-24 rounded-full mb-4"
            />
            <p className="text-lg font-medium">{name}</p>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>

        {/* Right card - Edit form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default ProfilePage
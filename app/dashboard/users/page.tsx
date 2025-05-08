"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch users from JSONPlaceholder API
    const fetchUsers = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleToggleDetails = (userId: number) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null); // If the user is already expanded, collapse it
    } else {
      setExpandedUserId(userId); // Expand the user details
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Users</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded-md shadow-md">
            {/* Display user name */}
            <button
              onClick={() => handleToggleDetails(user.id)}
              className="text-xl font-semibold text-green-800 mb-2 w-full text-left"
            >
              {user.name}
            </button>

            {/* Accordion - Toggle details based on expandedUserId */}
            {expandedUserId === user.id && (
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Company:</strong> {user.company.name}</p>
                <p><strong>Address:</strong> {user.address.street}, {user.address.city}, {user.address.zipcode}</p>

                {/* Embed Google Map */}
                <div className="mt-4">
                  <iframe
  width="100%"
  height="300"
  frameBorder="0"
  scrolling="no"
  marginHeight={0}  // <-- Change this to a number (no quotes)
  marginWidth={0}   // <-- Change this to a number (no quotes)
  src={`https://maps.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}&z=15&output=embed`}
/>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

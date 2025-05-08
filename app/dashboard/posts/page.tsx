// app/dashboard/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser) {
      router.push("/");
    } else {
      setUser(storedUser);
      fetchPosts(storedUser);
    }
  }, [router]);

  const fetchPosts = async (user: any) => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    if (user.email === "admin@admin.com") {
      setPosts(data);
    } else {
      const userPosts = data.filter((post: Post) => post.userId === user.id);
      setPosts(userPosts);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6">Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/dashboard/posts/${post.id}`} className="block p-5 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-green-800 mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm">{post.body.substring(0, 100)}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

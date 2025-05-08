"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import Framer Motion

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Comment {
  id: number;
  name: string;
  body: string;
  email: string;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showDetails, setShowDetails] = useState(false); // Track expanded/collapsed state

  useEffect(() => {
    if (!id) return;
    fetchPostAndComments(id);
  }, [id]);

  const fetchPostAndComments = async (postId: string) => {
    try {
      const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      const postData = await postRes.json();
      setPost(postData);

      const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
      const commentsData = await commentsRes.json();
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching post or comments:", error);
      router.push("/dashboard/posts");
    }
  };

  if (!post) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div 
        className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition" 
        onClick={() => setShowDetails(!showDetails)}
      >
        <h1 className="text-3xl font-bold text-green-700 mb-2">{post.title}</h1>
        <p className="text-gray-700">{post.body}</p>
      </div>

      {/* Animate the Details Section */}
      <motion.div 
        initial={{ opacity: 0, height: 0 }} 
        animate={{ opacity: showDetails ? 1 : 0, height: showDetails ? "auto" : 0 }} 
        transition={{ duration: 0.5 }} 
        className="mt-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-green-600">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-white rounded-2xl shadow"
            >
              <h3 className="font-bold text-green-800">{comment.name}</h3>
              <p className="text-sm text-gray-600">{comment.email}</p>
              <p className="mt-2 text-gray-700">{comment.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

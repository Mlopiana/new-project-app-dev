"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Updated import for ApexCharts
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ChartsPage() {
  const router = useRouter();
  const [usersCount, setUsersCount] = useState<number>(0);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || storedUser.email !== "admin@admin.com") {
      router.push("/");
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [users, posts, comments] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/users").then(res => res.json()),
        fetch("https://jsonplaceholder.typicode.com/posts").then(res => res.json()),
        fetch("https://jsonplaceholder.typicode.com/comments").then(res => res.json())
      ]);

      setUsersCount(users.length);
      setPostsCount(posts.length);
      setCommentsCount(comments.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const chartOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    labels: ["Users", "Posts", "Comments"],
    colors: ["#1D4ED8", "#10B981", "#F59E0B"],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
        },
      },
    }],
    legend: {
      position: "bottom",
    },
  };

  const chartSeries = [usersCount, postsCount, commentsCount];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Charts</h1>
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={350} />
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="bg-white rounded-2xl shadow-md p-4 w-40 text-center">
            <p className="text-gray-500">Users</p>
            <p className="text-xl font-bold text-green-700">{usersCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 w-40 text-center">
            <p className="text-gray-500">Posts</p>
            <p className="text-xl font-bold text-green-700">{postsCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 w-40 text-center">
            <p className="text-gray-500">Comments</p>
            <p className="text-xl font-bold text-green-700">{commentsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

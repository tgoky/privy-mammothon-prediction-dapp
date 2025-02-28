"use client";
import { useEffect, useState } from "react";

interface GithubProps {
  githubrepo: string; // Format: "owner/repo"
  targetStars?: number | null; // Target stars count
  onTargetReached?: () => void; // Callback to disable buttons
}

const Github = ({ githubrepo, targetStars, onTargetReached }: GithubProps) => {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('GitHub Token:', process.env.REACT_APP_GITHUB_TOKEN); // Log the token to the console

    const cacheKey = `github-stars-${githubrepo}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      setStars(Number(cachedData));
      setLoading(false);
      return;
    }

    const fetchStars = async () => {
      try {
        const [owner, repo] = githubrepo.split("/");
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Authorization: ` ${process.env.REACT_APP_GITHUB_TOKEN}`, // for test purposes - only read property written, would destroy it after mammothon
          },
        });

        if (!response.ok) {
          console.error("Response status:", response.status);
          console.error("Response headers:", response.headers);
          const errorData = await response.json();
          console.error("Error data:", errorData);
          throw new Error(`Failed to fetch stars: ${response.status}`);
        }

        const data = await response.json();
        setStars(data.stargazers_count);
        sessionStorage.setItem(cacheKey, String(data.stargazers_count)); // Store in cache
        setLoading(false);

        if (targetStars && data.stargazers_count >= targetStars) {
          onTargetReached?.();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch stars");
        setLoading(false);
      }
    };

    fetchStars();
  }, [githubrepo]); // Only fetch when `githubrepo` changes

  if (loading) {
    return <span className="text-gray-400">Loading stars...</span>;
  }

  if (error) {
    return <span className="text-red-500">Error: {error}</span>;
  }

  return (
    <span className="text-yellow-400 drop-shadow-lg animate-pulse transform hover:scale-105 transition duration-300">
      current repo : ⭐ {stars} stars
    </span>
  );
  
};

export default Github; 
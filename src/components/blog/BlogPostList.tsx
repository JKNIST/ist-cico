import { useState } from "react";
import { BlogPost } from "@/types/blog";
import { BlogPostCard } from "./BlogPostCard";
import { useTranslation } from "react-i18next";

interface BlogPostListProps {
  posts: BlogPost[];
}

export function BlogPostList({ posts }: BlogPostListProps) {
  const { t } = useTranslation();
  const [expandedPostIds, setExpandedPostIds] = useState<Set<string>>(new Set());
  const [readPosts, setReadPosts] = useState<Set<string>>(new Set());

  const handleExpandPost = (postId: string, isExpanded: boolean) => {
    setExpandedPostIds((prev) => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(postId);
        // Markera som läst när användaren expanderar
        setReadPosts((prevRead) => new Set(prevRead).add(postId));
        // Dispatcha event för att andra komponenter kan lyssna
        window.dispatchEvent(
          new CustomEvent("blogPostReadUpdated", {
            detail: { postId },
          })
        );
      } else {
        newSet.delete(postId);
      }
      return newSet;
    });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Inga inlägg att visa</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          post={post}
          isExpanded={expandedPostIds.has(post.id)}
          isRead={readPosts.has(post.id) || post.isRead}
          onExpandChange={(isExpanded) => handleExpandPost(post.id, isExpanded)}
        />
      ))}
    </div>
  );
}

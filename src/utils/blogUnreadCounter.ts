import { allBlogPosts } from "@/data/blog/BlogPostsData";

const STORAGE_KEY = "unreadInternalBlogPosts";

/**
 * Räknar antal olästa interna blogginlägg som är publicerade
 */
export const countUnreadInternalBlogPosts = (): number => {
  return allBlogPosts.filter(
    (post) =>
      post.internalOnly === true &&
      post.isRead === false &&
      post.status === "Publicerad"
  ).length;
};

/**
 * Hämtar räknare från localStorage
 */
export const getUnreadInternalBlogCountFromStorage = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : countUnreadInternalBlogPosts();
  } catch {
    return countUnreadInternalBlogPosts();
  }
};

/**
 * Sparar räknare till localStorage
 */
export const saveUnreadInternalBlogCountToStorage = (count: number): void => {
  try {
    localStorage.setItem(STORAGE_KEY, count.toString());
  } catch {
    // Ignorera localStorage-fel
  }
};

/**
 * Uppdaterar räknare och dispatchar event
 */
export const updateUnreadInternalBlogCount = (): void => {
  const count = countUnreadInternalBlogPosts();
  saveUnreadInternalBlogCountToStorage(count);
  
  window.dispatchEvent(
    new CustomEvent("unreadInternalBlogPostsUpdated", {
      detail: { count },
    })
  );
};

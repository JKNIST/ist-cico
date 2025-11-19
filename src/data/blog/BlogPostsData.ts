import { BlogPost } from "@/types/blog";
import { importantDatesPosts } from "./posts/ImportantDatesPosts";
import { regularUpdatesPosts } from "./posts/RegularUpdatesPosts";
import { informationPosts } from "./posts/InformationPosts";
import { scheduledPosts } from "./posts/ScheduledPosts";

export const allBlogPosts: BlogPost[] = [
  ...importantDatesPosts,
  ...regularUpdatesPosts,
  ...informationPosts,
  ...scheduledPosts,
];

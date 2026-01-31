"use client";

import { togglePostLikeState } from "@/actions/posts";
import { formatDate } from "@/lib/format";
import Image, { ImageLoaderProps } from "next/image";
import { useOptimistic } from "react";
import LikeButton from "./like-icon";

type Post = {
  image: string;
  title: string;
  userFirstName: string;
  createdAt: string;
  content: string;
  id: number;
  likes: number;
  isLiked: boolean;
};

function imageLoader(config: ImageLoaderProps): string {
  const urlStart = config.src.split("upload/")[0];
  const urlEnd = config.src.split("upload/")[1];
  const transformation = `w_${200},q_${config.quality}`;
  return `${urlStart}upload/${transformation}/${urlEnd}`;
}

function Post({
  post,
  action,
}: {
  post: Post;
  action: (id: number) => Promise<void>;
}) {
  return (
    <article className="post">
      <div className="post-image">
        {post.image && (
          <Image
            src={post.image}
            loading="eager"
            loader={imageLoader}
            alt={post.title}
            quality={50}
            width={200}
            height={120}
          />
        )}
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form
              action={action.bind(null, post.id)}
              className={post.isLiked ? "liked" : ""}
            >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }: { posts: Post[] }) {
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, updatedPostId: number) => {
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === updatedPostId,
      );
      if (updatedPostIndex === -1) {
        return prevPosts;
      }
      const updatedPost = { ...prevPosts[updatedPostIndex] };
      updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
      updatedPost.isLiked = !updatedPost.isLiked;

      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPost;
      return newPosts;
    },
  );

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function updatePost(id: number) {
    setOptimisticPosts(id);
    await togglePostLikeState(id);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}

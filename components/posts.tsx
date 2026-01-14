/* eslint-disable @next/next/no-img-element */
import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";

type Post = {
  image: string;
  title: string;
  userFirstName: string;
  createdAt: string;
  content: string;
  id: number;
};

function Post({ post }: { post: Post }) {
  return (
    <article className="post">
      <div className="post-image">
        {post.image && <img src={post.image} alt={post.title} />}
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
            <LikeButton />
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  return (
    <ul className="posts">
      {posts.map((post) => (
        <li key={post.id}>
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}

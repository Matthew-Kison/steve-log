import fs from "fs";
import path from "path";
import Link from "next/link";

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">게시물 목록</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.filename}>
            <Link href={`/posts/${post.filename}`}>{post.filename}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = await fs.promises.readdir(postsDirectory);
  return filenames
    .filter((name) => name.endsWith(".md"))
    .map((name) => ({ filename: name.replace(".md", "") }));
}

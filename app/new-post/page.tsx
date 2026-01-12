import PostForm from "@/components/post-form";
import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";

export default function NewPostPage() {
  async function createPost(
    prevState: { errors?: string[] },
    formData: FormData
  ) {
    "use server";

    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");

    const errors: string[] = [];

    if (!title || !title.toString().trim()) {
      errors.push("Title is required");
    }

    if (!content || !content.toString().trim()) {
      errors.push("Content is required");
    }

    if (!image || !(image instanceof File) || image.size === 0) {
      errors.push("Image is required");
    }

    if (errors.length > 0) {
      return { errors };
    }

    await storePost({
      imageUrl: "",
      title: title as string,
      content: content as string,
      userId: 1,
    });

    redirect("/feed");
  }

  return <PostForm action={createPost} />;
}

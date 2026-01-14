"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(
  _prevState: { errors?: string[] },
  formData: FormData
) {
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

  let imageUrl: string;

  try {
    imageUrl = await uploadImage(image as File);
  } catch {
    throw new Error(
      "Image upload failed, post was not created. Please try again later."
    );
  }

  await storePost({
    imageUrl,
    title: title as string,
    content: content as string,
    userId: 1,
  });

  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function togglePostLikeState(id: number) {
  await updatePostLikeStatus(id, 2);
  revalidatePath("/", "layout");
}

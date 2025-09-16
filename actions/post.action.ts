"use server";

import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getDBUserId } from "./user.action";

export async function createPost(content: string, imageUrl: string) {
        try {
                const userId = await getDBUserId();

                // Create post
                const post = await prisma.post.create({
                        data: {
                                content,
                                image: imageUrl,
                                authorId: userId,
                        },
                });
                revalidatePath("/");
                return { success: true, post };
        } catch (error) {
                console.log("Create Post Error", error);
                return { success: false, error: "Failed to create post" };
        }
}

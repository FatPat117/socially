"use server";

import prisma from "@/prisma/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
        try {
                const { userId } = await auth();
                const user = await currentUser();
                if (!userId || !user) return;

                // Check if user already exists
                const existingUser = await prisma.user.findUnique({
                        where: {
                                clerkId: userId,
                        },
                });

                if (existingUser) {
                        return existingUser;
                }

                // This data get from clerk
                const dbUser = await prisma.user.create({
                        data: {
                                clerkId: userId,
                                name: `${user.firstName || ""}  ${user.lastName || ""}`,
                                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                                email: user.emailAddresses[0].emailAddress, // get email from clerk
                                image: user.imageUrl,
                        },
                });
                return dbUser;
        } catch (error) {
                console.log("Error in syncUser", error);
        }
}

export async function getUserByClerkId(clerkId: string) {
        try {
                return prisma.user.findUnique({
                        where: {
                                clerkId: clerkId,
                        },
                        include: {
                                _count: {
                                        select: {
                                                followers: true,
                                                following: true,
                                                posts: true,
                                        },
                                },
                        },
                });
        } catch (error) {
                console.log("Error get User by Id", error);
        }
}

export async function getDBUserId() {
        const { userId: clerkId } = await auth();

        if (!clerkId) return null;

        const user = await getUserByClerkId(clerkId);

        if (!user) throw new Error("User not found");

        return user.id;
}

export async function getRandomUser() {
        try {
                const userId = await getDBUserId();
                if (!userId) return [];
                // Get ranjdom 3 users exclude ourselves and users that we've already followed
                const randomUsers = await prisma.user.findMany({
                        where: {
                                AND: [
                                        { NOT: { id: userId } },
                                        {
                                                NOT: {
                                                        followers: {
                                                                some: {
                                                                        followerId: userId,
                                                                },
                                                        },
                                                },
                                        },
                                ],
                        },

                        select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                                _count: {
                                        select: {
                                                followers: true,
                                        },
                                },
                        },
                        take: 3,
                });
                return randomUsers;
        } catch (error) {
                console.log("Error fetching random users", error);
                return [];
        }
}

export async function toggleFollow(targetUserId: string) {
        try {
                const userId = await getDBUserId();
                if (!userId) return;
                if (userId == targetUserId) throw new Error("You cannot follow yourself");

                const existingFollow = await prisma.follows.findUnique({
                        where: {
                                followerId_followingId: {
                                        followerId: userId,
                                        followingId: targetUserId,
                                },
                        },
                });

                if (existingFollow) {
                        await prisma.follows.delete({
                                where: {
                                        followerId_followingId: {
                                                followerId: userId,
                                                followingId: targetUserId,
                                        },
                                },
                        });
                } else {
                        // follow
                        await prisma.$transaction([
                                prisma.follows.create({
                                        data: {
                                                followerId: userId,
                                                followingId: targetUserId,
                                        },
                                }),
                                prisma.notification.create({
                                        data: {
                                                userId: targetUserId,
                                                creatorId: userId,
                                                type: "FOLLOW",
                                        },
                                }),
                        ]);
                }

                revalidatePath("/");
                return { success: true };
        } catch (error) {
                console.log("error in toggleFollow", error);
                return { success: false, error: "Error toggling Follow" };
        }
}

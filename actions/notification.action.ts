"use server";

import prisma from "@/prisma/prisma";
import { getDBUserId } from "./user.action";

export async function getNotifications() {
        try {
                const userId = await getDBUserId();
                if (!userId) return [];

                const notifications = await prisma.notification.findMany({
                        where: {
                                userId: userId,
                        },
                        include: {
                                creator: {
                                        select: {
                                                id: true,
                                                name: true,
                                                username: true,
                                                image: true,
                                        },
                                },
                                post: {
                                        select: {
                                                id: true,
                                                content: true,
                                                image: true,
                                        },
                                },
                                comment: {
                                        select: {
                                                id: true,
                                                content: true,
                                                createdAt: true,
                                        },
                                },
                        },
                        orderBy: {
                                createdAt: "desc",
                        },
                });

                return notifications;
        } catch (error) {
                console.log("Error fetching notifications", error);
                throw new Error("failed to fetch notification");
        }
}
export async function markNotificationsAsRead(notificationIds: string[]) {
        try {
                await prisma.notification.updateMany({
                        where: {
                                id: {
                                        in: notificationIds,
                                },
                        },
                        data: {
                                read: true,
                        },
                });

                return { success: true };
        } catch (error) {
                console.error("Error marking notifications as read:", error);
                return { success: false };
        }
}

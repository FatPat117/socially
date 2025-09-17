import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action";
import NotFound from "@/app/not-found";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({ params }: { params: { username: string } }) {
        const user = await getProfileByUsername(params.username);
        if (!user) {
                return {
                        title: "Profile not found",
                        description: "Profile not found",
                };
        }
        return {
                title: user?.name ?? user?.username,
                description: user?.bio || `Check out ${user?.username}'s profile`,
        };
}

const ProfilePage = async ({ params }: { params: { username: string } }) => {
        const user = await getProfileByUsername(params.username);
        if (!user) return NotFound();

        const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
                getUserPosts(user.id),
                getUserLikedPosts(user.id),
                isFollowing(user.id),
        ]);

        return (
                <ProfilePageClient
                        posts={posts}
                        likedPosts={likedPosts}
                        isFollowing={isCurrentUserFollowing}
                        user={user}
                />
        );
};

export default ProfilePage;

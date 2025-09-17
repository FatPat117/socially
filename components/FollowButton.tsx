"use client";

import { toggleFollow } from "@/actions/user.action";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";

const FollowButton = ({ userId }: { userId: string }) => {
        const [isLoading, setIsLoading] = useState(false);

        const handleFollow = async () => {
                setIsLoading(true);
                try {
                        await toggleFollow(userId);
                        toast.success("Followed successfully");
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_error) {
                        toast.error("Something went wrong");
                } finally {
                        setIsLoading(false);
                }
        };
        return (
                <Button size="sm" variant={"secondary"} onClick={handleFollow} disabled={isLoading} className="w-20">
                        {isLoading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Follow"}
                </Button>
        );
};

export default FollowButton;

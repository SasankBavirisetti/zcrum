"use client";

import { useState } from "react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { formatDistanceToNow } from "date-fns";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";

// ✅ FIXED: Converted border colors to background colors for the absolute line strip
const priorityColor = {
  LOW: "bg-green-600",
  MEDIUM: "bg-yellow-300",
  HIGH: "bg-orange-400",
  URGENT: "bg-red-400",
};

// Kept this string mapping untouched so your Dialog modal border does not break
const priorityBorderColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params) => {
    router.refresh();
    onUpdate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card
        // ✅ FIXED: Added relative overflow-hidden to clip the absolute strip perfectly at the corners
        className="cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden bg-black"
        onClick={() => setIsDialogOpen(true)}
      >
        {/* ✅ FIXED: Full-bleed horizontal absolute accent strip line at the very top edge */}
        <div
          className={`absolute top-0 left-0 right-0 h-[4px] ${priorityColor[issue.priority]}`}
        />

        {/* ✅ FIXED: Removed the padding-clashing border styles from CardHeader */}
        <CardHeader className="pt-5 ">
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 -mt-3 ">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1 rounded-md pt-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3 bg-black border-none">
          <UserAvatar user={issue.assignee} />

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityBorderColor[issue.priority]}
        />
      )}
    </>
  );
}

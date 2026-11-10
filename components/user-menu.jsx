"use client";

import { useState, useEffect } from "react"; // 1. Import state hooks
import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

const UserMenu = () => {
  const [isMounted, setIsMounted] = useState(false);

  // 2. Set mounted to true once the component runs on the client browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Render a safe layout placeholder matching the profile image dimensions during SSR
  if (!isMounted) {
    return <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />;
  }

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Organizations"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href="/onboarding"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;

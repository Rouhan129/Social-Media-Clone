"use client";

import React from "react";
import Button from "@/app/components/Button";

const FollowUnfollow = ({ follow, onToggle }) => {
  return (
    <div>
      {follow ? (
        <Button onClick={onToggle}>
          Unfollow
        </Button>
      ) : (
        <Button onClick={onToggle}>Follow</Button>
      )}
    </div>
  );
};

export default FollowUnfollow;

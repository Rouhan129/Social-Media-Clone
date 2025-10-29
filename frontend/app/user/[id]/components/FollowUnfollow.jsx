"use client"

import React from 'react'
import Button from '@/app/components/Button'

const FollowUnfollow = (follow, onToggle) => {
  return (
    <div>
      {follow ? <Button className='bg-red-500' onClick={onToggle}>Unfollow</Button> : <Button onClick={onToggle}>Follow</Button>}
    </div>
  )
}

export default FollowUnfollow
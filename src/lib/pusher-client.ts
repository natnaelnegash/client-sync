"use client"

import Pusher from 'pusher-js';

console.log(process.env.NEXT_PUBLIC_PUSHER_KEY);
console.log(process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);

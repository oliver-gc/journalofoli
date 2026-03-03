import { createFileRoute, redirect } from '@tanstack/react-router'
import {  getSession } from '@/lib/auth.server'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { user: session.user };
  }})

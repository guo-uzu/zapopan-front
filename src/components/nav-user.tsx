"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation" // Use router for client-side redirects

interface UserData {
  full_name: string
  avatar_url: string
  email: string
  id: string
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const supabase = createClient()
  const router = useRouter() // Initialize router
  
  // FIX 1: Initialize with 'null', not '{}'
  const [userData, setUserData] = useState<UserData | null>(null)
  const [fallBackAvatar, setFallbackAvatar] = useState<string>("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!user) return 

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        // We don't throw on profileError immediately, in case the user exists
        // in Auth but hasn't been created in the 'users' table yet.

        if (profile) {
          setUserData(profile as UserData)
          // Safe check for full_name before accessing index 0
          setFallbackAvatar(profile.full_name?.[0] || "U")
        } else {
          // FIX 3: If no profile exists, create a temporary object from Auth data
          // You cannot just pass 'user.email' string to setUserData
          setUserData({
            id: user.id,
            email: user.email || "",
            full_name: user.email || "Usuario", // Fallback name
            avatar_url: ""
          })
          setFallbackAvatar(user.email?.[0]?.toUpperCase() || "U")
        }

      } catch (error) {
        // FIX 2: Cast error to Error type
        console.error('Error fetching user data:', (error as Error).message)
      }
    }

    fetchUserData()
  }, [supabase])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      // Use router.push for client-side navigation
      router.push("/sign-in")
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* Use Optional Chaining just in case */}
                <AvatarImage src={userData?.avatar_url} alt={userData?.full_name} />
                <AvatarFallback className="rounded-lg">{fallBackAvatar}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData?.full_name}</span>
                <span className="truncate text-xs">{userData?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData?.avatar_url} alt={userData?.full_name} />
                  <AvatarFallback className="rounded-lg">{fallBackAvatar}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData?.full_name}</span>
                  <span className="truncate text-xs">{userData?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
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
  DropdownMenuGroup,
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
import { redirect } from "next/navigation"

interface UserData {
  full_name: string
  avatar_url: string
  email: string
  id: string
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const supabase = createClient()
  const [userData, setUserData] = useState<UserData | null>({})
  const [fallBackAvatar, setFallbackAvatar] = useState<string>("")

  useEffect(() => {
    // Create an async function inside the effect
    const fetchUserData = async () => {
      try {
        // --- STEP 1: Get the Auth User ---
        // This gets the user's session from the browser's cookies
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!user) return // User is not logged in

        // We have the user! Now, let's get their profile.
        // --- STEP 2: Get the Profile Data ---
        // We use the user.id to find the matching row in our 'users' table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*') // Get the columns you need
          .eq('id', user.id) // Find the row where 'id' matches the auth user's id
          .single() // We expect only one row, so .single() is perfect

        if (profileError) throw profileError

        // --- STEP 3: Set the Data ---
        if (profile) {
          // If they have a profile AND a name, use that
          setUserData(profile)
          setFallbackAvatar(profile.full_name[0])
        } else {
          // Otherwise, just fall back to their email
          setUserData(profile.email)
        }

      } catch (error) {
        console.error('Error fetching user data:', error.message)
      }
    }

    // Call the function
    fetchUserData()
  }, [supabase])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      redirect("/sign-in")
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
                <AvatarImage src={userData?.avatar_url} alt={`Imagen de perfil de ${userData?.full_name}`} />
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
                  <AvatarImage src={userData?.avatar_url} alt={`Imagen de perfil de ${userData?.full_name}`} />
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

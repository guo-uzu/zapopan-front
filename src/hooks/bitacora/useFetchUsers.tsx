"use client"
import { useEffect, useState } from "react";
import { fetchUsersFilterBitacora, FetchUsersFilter } from "@/lib/data/usersFilter";

const useFetchUsers = () => {
  const [usersToFilter, setUsersToFilter] = useState<FetchUsersFilter>();
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchUsersFilterBitacora()
      if (data) setUsersToFilter(data)
    }
    fetchUsers()
  }, [])
  return usersToFilter
}

export default useFetchUsers

"use client"

import { Member, Profile, Server } from "@/generated/prisma/client"
import { cn } from "@/lib/utils"
import { ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { UserAvatar } from "../user-avatar"


const roleIconMap = {
  ["GUEST"]: null,
  ["MODERATOR"]: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
  ["ADMIN"]: <ShieldCheck className="size-4 ml-2 text-rose-500" />,
}

interface ServerMemberProps {
  member: Member & { profile: Profile },
  server: Server
}
export const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role]
  const onClick = () =>{
    router.push(`/servers/${params.serverId}/conversations/${member.id}`)
  }
  return (
    <button onClick={onClick} className={cn("group flex px-2 py-2 rounded-md items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params.membersId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
      <UserAvatar src={member.profile.imageUrl} className="size-8 md:size-8" />
      <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",params?.membersId === member.id && "text-primary dark:text-zinc-200")}>{member.profile.name}</p>
      {icon}
    </button>
  )
}

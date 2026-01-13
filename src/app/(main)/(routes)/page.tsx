import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Home = async() => {
  const user =  await currentUser()
  if(!user) {
    redirect("/")
  }
  return (
    <div>
      <UserButton />
    </div>
  )
}

export default Home

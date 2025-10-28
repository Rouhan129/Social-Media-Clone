// import { redirect } from "next/navigation";

export default function Home() {

  // const token  = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  // if (!token) redirect('/login')
  return (
    <main>
      <h1>Welcome</h1>
      <p>You are logged in!</p>
      {/* <button onClick={() => {localStorage.clear(); window.location.href = '/login'}}>Logout</button> */}
    </main>
  );
}

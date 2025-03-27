import Link from "next/link";

export default function About() {
    return (
        <div className="bg-white w-full min-h-screen">
            <h1 className="text-black">About us</h1>
            <p className="text-black">hello djfasdfoas asdfja;lskdnfl</p>
            
            <Link href={"/"}>
            <button className="p-3 px-5 bg-blue-700 text-white rounded-lg">
                Home page
            </button>
            </Link>
        </div>
    )
}
import SideBar from "@/component/SideBar";
import { sidebarItems } from "../page";

export default function Settings() {

    return (
        <div className="flex bg-white">
            <SideBar sidebarItems={sidebarItems} />
            <h1 className="text-3xl text-black">Settings Page</h1>
        </div>
    );
};
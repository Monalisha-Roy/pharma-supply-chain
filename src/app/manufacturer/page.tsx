// Manufacturer page example
import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { GiMedicinePills } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { FaUndo } from "react-icons/fa";


export default function Manufacturer() {
    const sidebarItems = [
        {
            icon: <MdDashboard />,
            text: "Dashboard",
            route: "/manufacturer"
        },
        {
            icon: <GiMedicinePills />,
            text: "Batches",
            route: "/manufacturer/batches"
        },
        {
            icon: <TbTruckDelivery />,
            text: "Transfers",
            route: "/manufacturer/transfers"
        },
        {
            icon: <FaUndo/>,
            text: "Recall",
            route: "/manufacturer/recall"
        },
        {
            icon: <MdOutlineSettings />,
            text: "Settings",
            route: "/manufacturer/settings"
        }
    ];

    return (
        <div className="flex bg-white">
            <SideBar sidebarItems={sidebarItems} />
            <h1 className="text-3xl text-black">Dashboard page</h1>
        </div>
    );
};
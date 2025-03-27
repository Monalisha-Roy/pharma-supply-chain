import SideBar from "@/component/SideBar";
import { FaUndo } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

export default function Recall() {
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
            <h1 className="text-3xl text-black">Recall page</h1>
        </div>
    );
};
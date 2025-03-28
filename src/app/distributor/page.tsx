import SideBar from "@/component/SideBar";

export default function Manufacturer() {
    return (
        <div className="w-full min-h-screen bg-white flex">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <div className="flex-1 p-6 ml-10 mt-10 flex flex-col space-y-6">
                
                {/* GPS Tracking (Landscape Box) */}
                <div className="bg-[#0cc0cf] bg-opacity-60 text-white rounded-xl shadow-lg p-6 h-52 flex items-center justify-center text-2xl font-semibold">
                    GPS Tracking of Shipments
                </div>

                {/* Bottom Two Boxes */}
                <div className="grid grid-cols-2 gap-6">
                    
                    {/* Shipments in Transit */}
                    <div className="bg-gray-600 bg-opacity-60 text-white rounded-xl shadow-lg p-6 h-48 flex items-center justify-center text-xl font-semibold">
                        Shipments in Transit
                    </div>

                    {/* Temperature Alerts */}
                    <div className="bg-red-500 bg-opacity-60 text-white rounded-xl shadow-lg p-6 h-48 flex items-center justify-center text-xl font-semibold">
                        Temperature Alerts
                    </div>
                </div>
            </div>
        </div>
    );
}

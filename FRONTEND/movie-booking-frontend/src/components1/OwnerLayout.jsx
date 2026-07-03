import { Outlet } from "react-router-dom";
import OwnerSidebar from "../components1/OwnerSidebar";
import OwnerNavbar from "../components1/OwnerNavbar";

function OwnerLayout() {

    return (

        <div className="flex">

            <OwnerSidebar />

            <div className="flex-1 bg-black min-h-screen">

                <OwnerNavbar />

                <div className="p-8">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}

export default OwnerLayout;
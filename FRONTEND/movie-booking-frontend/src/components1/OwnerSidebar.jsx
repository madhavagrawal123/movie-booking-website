import { Link, useLocation } from "react-router-dom";

function OwnerSidebar() {
    const location = useLocation();

    const menus = [
        {
            name: "Dashboard",
            path: "/owner"
        },
        {
            name: "My Theatres",
            path: "/owner/theatres"
        }
    ];

    return (
        <div className="w-64 bg-zinc-950 border-r border-red-700 text-white h-screen">

            <div className="p-6 border-b border-red-700">
                <h1 className="text-2xl font-bold text-red-500">
                    🎬 Showly
                </h1>
            </div>

            <div className="flex flex-col mt-4">

                {
                    menus.map(menu => (

                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`px-6 py-4 transition

                            ${
                                location.pathname === menu.path
                                ?
                                "bg-red-600"
                                :
                                "hover:bg-zinc-800"
                            }`}
                        >

                            {menu.name}

                        </Link>

                    ))
                }

            </div>

        </div>
    );
}

export default OwnerSidebar;
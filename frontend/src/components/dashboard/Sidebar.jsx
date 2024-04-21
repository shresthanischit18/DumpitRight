import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { SIDEBAR_LINKS } from "./SidebarLinks";
import { FaPowerOff } from "react-icons/fa";
import { getCookie, removeCookie } from "../../utils";
import logo from "../../assets/logo.png";
import { FaSignInAlt } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(getCookie("user"));
  return (
    <div>
      <Card className="h-full w-full max-w-[20rem] p-4 pt-0 bg-white border-r border-gray-200 shadow-none rounded-none flex flex-col justify-between">
        <div>
          <Link to={userInfo.role === "admin" ? "" : "/"}>
            <div className="mb-2 px-4 pt-0 pb-2">
              <img
                src={logo}
                alt=""
                className="w-42 lg:max-h-20 m-3 object-center sm:max-h-[50px]"
              />
            </div>
          </Link>

          <List>
            {SIDEBAR_LINKS[userInfo?.role]?.map((link, index) => {
              if (link?.requiresSubscription) {
                return (
                  <Link
                    to={userInfo.subscription ? link.path : "/subscription"}
                    key={index}
                  >
                    <ListItem key={index}>
                      <ListItemPrefix>{link.icon}</ListItemPrefix>
                      {link.name}
                    </ListItem>
                  </Link>
                );
              }

              if (link.name === "Profile") {
                return (
                  <Link
                    to={`/${userInfo?.role}/dashboard/profile/${userInfo?._id}`}
                    key={index}
                  >
                    <ListItem key={index}>
                      <ListItemPrefix>{link.icon}</ListItemPrefix>
                      {link.name}
                    </ListItem>
                  </Link>
                );
              }

              return (
                <Link to={link.path} key={index}>
                  <ListItem key={index}>
                    <ListItemPrefix>{link.icon}</ListItemPrefix>
                    {link.name}
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </div>

        <List>
          <ListItem
            onClick={() => {
              removeCookie("user");
              removeCookie("authToken");
              navigate("/login");
            }}
            className="bg-gray-300"
          >
            <ListItemPrefix>
              <FaSignInAlt className="h-5 w-5 rotate-180" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
    </div>
  );
};

export default Sidebar;

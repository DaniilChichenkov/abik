import { Outlet } from "react-router";

import { NavBar } from "~/components";

export const loader = async () => {
  console.log("Loader hit on layout");
  return true;
};

const HomeLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default HomeLayout;

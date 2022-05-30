import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { CrossIcon } from "../assets";

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const navBarItems = [
    { lbl: "LOREM IPSUM", slug: "/" },
    {
      lbl: "LOREM IPSUM",
      slug: "/",
    },
    { lbl: "LOREM IPSUM", slug: "/" },
    { lbl: "LOREM IPSUM", slug: "/" },
  ];

  useEffect(() => {
    document.body.addEventListener("click", () => {
      document.body.style.overflowY = "auto";
      setOpenSidebar(false);
    });
  }, [setOpenSidebar]);

  return (
    <div
      className={`sidebar-s fixed rel anim ${openSidebar ? "show" : "hide"}`}
    >
      <div
        className={`side-block flex col anim ${openSidebar ? "show" : "hide"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="hdr flex aic justify-end">
          <div
            className="icon-close flex aic jc"
            onClick={(e) => {
              setOpenSidebar(false);
            }}
          >
            <CrossIcon />
          </div>
        </div>
        <div>
          <div className="items flex aic flex-col">
            {navBarItems.map((item, index) => (
              <div
                key={index}
                // exact
                // to={`${item.slug}`}
                className={`list-item flex `}
                onClick={(e) => {
                  setOpenSidebar(false);
                }}
              >
                <div className="li cfff font">{item.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

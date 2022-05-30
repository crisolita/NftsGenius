import React, { useEffect, useState } from "react";
import {
  InstaIcon,
  FbIcon,
  TwitterIcon,
  YouTubeIcon,
  LinkInIcon,
} from "../assets";

const Footer = () => {
  return (
    <div className="footer-comp flex flex-col">
      <div className="wrapWidth wrap flex jc flex-col">
        <div className="container-f flex aic">
          <div className="left flex flex-col">
            <img src="./images/logo.svg" className="logo-img" />
            <div className="left-desc">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliqua erat
              volutpat. Ut wisi enim ad minim veniam.
            </div>
          </div>
          <div className="center flex jc">
            <div className="center-left flex flex-col">
              <div className="item">Macketplace</div>
              <div className="item">Create</div>
              <div className="item">Events</div>
            </div>
            <div className="center-right flex flex-col">
              <div className="item">Privacy Policy</div>
              <div className="item">Terms of Service</div>
            </div>
          </div>
          <div className="right flex flex-col jc">
            <div className="item">Follow us</div>
            <div className="social flex aic">
              <div className="ico">
                <InstaIcon />
              </div>
              <div className="ico">
                <FbIcon />
              </div>
              <div className="ico">
                <TwitterIcon />
              </div>
              <div className="ico">
                <YouTubeIcon />
              </div>
              <div className="ico">
                <LinkInIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copy-right flex">
        <div className="wrapWidth">
          <div className="lbl">EYSS ©2021 All Rights Reserved</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

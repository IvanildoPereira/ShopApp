import React from "react";
import { Link } from "react-router-dom";
import acessorie from "../../../assets/acessories.png";
import cellPhone from "../../../assets/cellphone.png";
import computer from "../../../assets/computer.png";
import device from "../../../assets/device.png";
import office from "../../../assets/device.png";
import instrument from "../../../assets/instrument.png";
import videoGame from "../../../assets/video_game.png";
import tv from "../../../assets/tv.png";
import watch from "../../../assets/watch.png";
import others from "../../../assets/others.png";

export default function HomeCategories() {
  return (
    <section id="categories_home">
      <p className="sub_title">Categories</p>
      <div className="categories_box">
        <Link to="/products?category=Accessories&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={acessorie} alt="" />
            <p>Acessories</p>
          </div>
        </Link>
        <Link to="/products?category=CellPhones&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={cellPhone} alt="" />
            <p>CellPhones</p>
          </div>
        </Link>
        <Link to="/products?category=Computers%20%26%20Laptops&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={computer} alt="" />
            <p>Computers & Laptops</p>
          </div>
        </Link>
        <Link to="/products?category=Devices&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={device} alt="" />
            <p>Devices</p>
          </div>
        </Link>
        <Link to="/products?category=Musical%20Instruments&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={instrument} alt="" />
            <p>Musical Instruments</p>
          </div>
        </Link>
        <Link to="/products?category=Office%20Electronics&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={office} alt="" />
            <p>Office Electronics</p>
          </div>
        </Link>
        <Link to="/products?category=Video%20Games&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={videoGame} alt="" />
            <p>Video Games</p>
          </div>
        </Link>
        <Link to="/products?category=TV%20%26%20Video&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={tv} alt="" />
            <p>TV & Video</p>
          </div>
        </Link>
        <Link to="/products?category=Watches%20%26%20Smart%20Watches&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={watch} alt="" />
            <p>Watches & Smart Watches</p>
          </div>
        </Link>
        <Link to="/products?category=Others&sort=recently&page=1&perPage=6">
          <div className="box">
            <img src={others} alt="" />
            <p>Others</p>
          </div>
        </Link>
      </div>
    </section>
  );
}

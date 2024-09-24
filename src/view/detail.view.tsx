import React, { useEffect } from 'react';
import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import FishDetail from '../component/detailPage/detail.component';
import HomeView from "../component/homePage/home.component";

const DetailView: React.FC = () => {
  return (
    <>
      <IndexNavbar />
      <HomeView/>
      <div className="wrapper">
        <div className="main">
          <FishDetail />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DetailView;

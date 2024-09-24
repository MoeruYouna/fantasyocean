import React from "react";

function HomeView() {
  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("../assets/img/aquarium/BG_4.jpg") + ")"
          }}
        ></div>
      </div>
    </>
  );
}

export default HomeView;

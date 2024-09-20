import React, { useEffect } from "react";
import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import CartPage from "../component/cartPage/cart.component";
import HomeView from "../component/homePage/home.component";

const CartView: React.FC = () => {
    useEffect(() => {
        document.body.classList.add("index-page");
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;

        return () => {
            document.body.classList.remove("index-page");
            document.body.classList.remove("sidebar-collapse");
        };
    }, []);

    return (
        <>
            <IndexNavbar />
            <HomeView />
            <div className="wrapper" style={{backgroundColor: '#f5f5f5'}}>
                <div className="main">
                    <CartPage />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default CartView;

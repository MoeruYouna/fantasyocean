import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import ShopPage from "../component/shopPage/shop.component";

const ShopView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <ShopPage />
                <Footer />
            </div>
        </>
    )
};

export default ShopView;

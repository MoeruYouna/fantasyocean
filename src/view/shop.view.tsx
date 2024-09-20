import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import ShopPage from "../component/shopPage/shop.component";
import HomeView from "../component/homePage/home.component";

const ShopView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <HomeView />
            <div className="wrapper" style={{backgroundColor: '#f5f5f5'}}>
                <ShopPage />
                <Footer />
            </div>
        </>
    )
};

export default ShopView;

import Navbar from "../component/homePage/navbar.component";
import Footer from "../component/homePage/footer.component";
import HomeView from "../component/homePage/home.component";

const IndexView: React.FC = () => {
    return (
        <>
            <Navbar />
            <HomeView />
            <Footer />
        </>
    )
};

export default IndexView;

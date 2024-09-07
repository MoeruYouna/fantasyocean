import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import HomeView from "../component/homePage/home.component";
import AboutPage from "../component/homePage/about.component";
import Testimonials from "../component/homePage/show.component";

const IndexView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <HomeView />
                <div className="main">
                    <AboutPage />
                </div>
                <Testimonials/>
                <Footer />
            </div>
        </>
    )
};

export default IndexView;

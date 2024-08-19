import IndexNavbar from "../component/homePage/navbar.component";
import Footer from "../component/homePage/footer.component";
import HomeView from "../component/homePage/home.component";
import AboutPage from "../component/homePage/about.component";

const IndexView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <HomeView />
                <div className="main">
                    <AboutPage />
                </div>
                <Footer />
            </div>
        </>
    )
};

export default IndexView;

import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import HomeView from "../component/homePage/home.component";
import AboutPage from "../component/homePage/about.component";
import ChatbotPage from "../component/chatbotPage/chatbot.component";


const IndexView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <HomeView />
            <div className="wrapper" style={{backgroundColor: '#f5f5f5'}}>
                <div className="main">
                    <AboutPage />
                </div>
                <ChatbotPage/>
                <Footer />
            </div>
        </>
    )
};

export default IndexView;

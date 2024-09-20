import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import SearchResultsPage from "../component/searchPage/search.component";
import HomeView from "../component/homePage/home.component";

const SearchView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <HomeView />
            <div className="wrapper" style={{backgroundColor: '#f5f5f5'}}> 
                <SearchResultsPage />
                <Footer />
            </div>
        </>
    )
};

export default SearchView;

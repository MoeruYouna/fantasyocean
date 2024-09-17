import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import SearchResultsPage from "../component/searchPage/search.component";

const SearchView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <SearchResultsPage />
                <Footer />
            </div>
        </>
    )
};

export default SearchView;

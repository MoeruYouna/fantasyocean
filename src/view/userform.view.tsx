import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import ProtectedRoute from "../component/loginPage/protectedRoute";
import UserFormPage from "../component/registerPage/userForm.component";
import HomeView from "../component/homePage/home.component";

const UserFormView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <HomeView />
            <div className="wrapper" style={{backgroundColor: '#f5f5f5'}}>
                <ProtectedRoute>
                    <UserFormPage/>
                </ProtectedRoute>
                <Footer />
            </div>
        </>
    )
};

export default UserFormView;

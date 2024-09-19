import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import ProtectedRoute from "../component/loginPage/protectedRoute";
import UserFormPage from "../component/registerPage/userForm.component";

const UserFormView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <ProtectedRoute>
                    <UserFormPage/>
                </ProtectedRoute>
                <Footer />
            </div>
        </>
    )
};

export default UserFormView;

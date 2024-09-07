import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import LoginPage from "../component/loginPage/login.component";

const LoginView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <LoginPage />
                <Footer />
            </div>
        </>
    )
};

export default LoginView;

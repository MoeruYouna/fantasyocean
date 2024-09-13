import IndexNavbar from "../component/index/navbar.component";
import Footer from "../component/index/footer.component";
import Register from "../component/registerPage/register.component";

const RegisterView: React.FC = () => {
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <Register />
                <Footer />
            </div>
        </>
    )
};

export default RegisterView;

import { useNavigate } from "react-router-dom";

const IndexView: React.FC = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/home')
    }

    return <button onClick={goToHome}>Home Page</button>;
};

export default IndexView;

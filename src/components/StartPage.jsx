import { useNavigate } from "react-router-dom";

export default function StartPage(){
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/questions");
    };

    return(
        <div className="startpage">
            <h1>Quizzical</h1>
            <p>A fun way to answer random questions</p>
            <button onClick={handleClick}>Start Quiz</button>
        </div>
    )
}
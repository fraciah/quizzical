import { useState, useEffect } from "react"
import PropTypes from 'prop-types';

//decoding the HTML entities in the questions and answers, so that they are displayed correctly
function decodeHTMLEntities(text) {
    const entities = {
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#039;': "'",
        '&ouml;': 'ö',
        '&auml;': 'ä'
    };
    return text.replace(/&[^;]+;/g, match => entities[match] || match);
}

export default function Questions({quizFinished}){
    const [questions, setQuestions] = useState([]);

    useEffect(() =>{
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(response =>response.json())
        .then(data => {
            const {results} = data;
            console.log(results);
            setQuestions(results);
        })
    }, [])

    return(
        <div className="questions">
            <h1>Questions</h1>
            <ol>
                {questions.map(question =>{
                    //using Fisher-Yates algorithm to shuffle the answers
                    const answers = [question.correct_answer, ...question.incorrect_answers];
                    for(let i=answers.length-1; i > 0; i--){
                        const j = Math.floor(Math.random() * (i+1));
                        [answers[i], answers[j]] = [answers[j], answers[i]];
                    }
                    return(
                        //each question has a unique key 
                        <li key={crypto.randomUUID()}>
                            <h3>{decodeHTMLEntities(question.question)}</h3>
                            <div className="answers">
                                {answers.map(answer =>(
                                    <div key={crypto.randomUUID()}
                                        >{decodeHTMLEntities(answer)}</div>
                                ))}
                            </div>
                        </li>
                    )
                })}
            </ol>
            <button className={quizFinished? "won-button": "play-button"}>Check answers</button>
        </div>
    )
}
Questions.propTypes = {
    quizFinished: PropTypes.bool.isRequired,
    setQuizFinished: PropTypes.func.isRequired
}
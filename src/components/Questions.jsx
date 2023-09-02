import { useState, useEffect } from "react"

export default function Questions(){
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
                            <h3>{question.question}</h3>
                            <div className="answers">
                                {answers.map(answer =>(
                                    <div key={crypto.randomUUID()}>{answer}</div>
                                ))}
                            </div>
                        </li>
                    )
                })}
            </ol>
            <button>Check answers</button>
        </div>
    )
}
import React from "react"
import Start from "./Components/Start"
import Questions from "./Components/Questions"

export default function App() {
    const [showQuiz, setShowQuiz] = React.useState(false)
    function onStartQuiz (){
        setShowQuiz(true)
    }
    return (
        <div className="app-container">
            {showQuiz ?   <Questions /> : <Start onStartQuiz = {onStartQuiz} />}
        </div>
    )
}
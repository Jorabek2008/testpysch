import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setStep } from "../../redux/slice/stepSlice";
import { toast } from "react-hot-toast";
import { Radio, RadioGroup } from "@nextui-org/react";

interface Question {
  number: number;
  questionTitle: string;
  questions: string[];
}

export const Quiz: React.FC<{ data: Question[] }> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const dispatch = useDispatch();

  const currentQuestion = data[currentQuestionIndex];

  useEffect(() => {
    dispatch(setStep(currentQuestion.number));
  }, [currentQuestion, dispatch]);

  const handleNext = () => {
    if (currentQuestionIndex < data.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Javobni tozalash
    } else {
      toast.success("Rahmat");
    }
  };

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="mx-5">
      <h1 className="text-large font-bold">Savol {currentQuestion.number}</h1>
      <p className="font-semibold">{currentQuestion.questionTitle}</p>
      <form className="w-full">
        {currentQuestion.questions.map((option, index) => (
          <RadioGroup key={index}>
            <Radio
              className="mt-1"
              value={option}
              onClick={() => handleAnswerChange(option)}
            >
              {option}
            </Radio>
          </RadioGroup>
        ))}
      </form>
      <button
        onClick={handleNext}
        disabled={!selectedAnswer}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: selectedAnswer ? "#0070f3" : "#eaeaea",
          color: selectedAnswer ? "#fff" : "#000",
          border: "none",
          borderRadius: "5px",
          cursor: selectedAnswer ? "pointer" : "not-allowed",
        }}
      >
        {currentQuestionIndex < data.length - 1 ? "Keyingi" : "Tugatish"}
      </button>
    </div>
  );
};

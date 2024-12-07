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
      setSelectedAnswer(null);
    } else {
      toast.success("Rahmat");
    }
  };

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  return (
    <div className="mx-5">
      <h1 className="text-large font-bold">Savol {currentQuestion.number}</h1>
      <p className="font-semibold">{currentQuestion.questionTitle}</p>

      <RadioGroup
        className="mt-4"
        value={selectedAnswer || ""}
        onValueChange={handleAnswerChange}
      >
        {currentQuestion.questions.map((option, index) => (
          <Radio key={index} value={option} className="mt-2">
            {option}
          </Radio>
        ))}
      </RadioGroup>

      <button
        onClick={handleNext}
        disabled={!selectedAnswer}
        className={`mt-5 px-5 py-2 rounded-md transition-colors ${
          selectedAnswer
            ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
            : "bg-gray-200 text-gray-700 cursor-not-allowed"
        }`}
      >
        {currentQuestionIndex < data.length - 1 ? "Keyingi" : "Tugatish"}
      </button>
    </div>
  );
};

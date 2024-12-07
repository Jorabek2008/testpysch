import { Button, Input } from "@nextui-org/react";
import { SiVitest } from "react-icons/si";
import { PiStudent } from "react-icons/pi";
import { MdQueuePlayNext } from "react-icons/md";
import { useState } from "react";
import { students } from "../mock";

export const SuperAdminPage = () => {
  const buttonClass = `!py-[12px] rounded-[8px] justify-start overflow-x-hidden relative`;
  const rows = [
    { title: "Testlar", icon: <SiVitest />, nextPage: "tests" },
    { title: "Talabalar", icon: <PiStudent />, nextPage: "students" },
    { title: "Natijalar", icon: <MdQueuePlayNext />, nextPage: "results" },
  ];
  const [active, setActive] = useState<string>("tests");
  const [questions, setQuestions] = useState<
    { question: string; answers: string[] }[]
  >([{ question: "", answers: [""] }]);

  const addAnswer = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].answers.push("");
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (
    qIndex: number,
    aIndex: number,
    value: string,
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answers: [""] }]);
  };

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [filter, setFilter] = useState<string>("all");

  const filteredStudents =
    filter === "all"
      ? students
      : students.filter((student) => student.group === filter);

  return (
    <div>
      <div className="w-full h-12 flex justify-end items-center">
        <h1 className="mr-5 font-semibold text-large">Admin</h1>
      </div>
      {/* home main section */}
      <div className="flex">
        <div className="w-[300px] bg-blue-500">
          <div className="mt-3 p-6 flex flex-col gap-4">
            {rows.map((item, index) => (
              <Button
                onClick={() => setActive(item.nextPage)}
                key={index}
                type="button"
                color="primary"
                className={
                  buttonClass +
                  `${item.nextPage === active ? " border-b-2 border-orange-600" : ""}`
                }
                startContent={<button>{item.icon}</button>}
                fullWidth={true}
                size="lg"
                variant="faded"
                radius="none"
              >
                {item.title}
              </Button>
            ))}
          </div>
        </div>
        <div className="w-full relative min-h-screen h-auto bg-blue-200 p-2 pb-10">
          {active === "tests" && (
            <div className="relative">
              <div className="flex items-center justify-between">
                <Input
                  className="m-2 max-w-[48%]"
                  label="Testning nomini kiriting!"
                  isRequired
                />
                <Input
                  className="m-2 max-w-[48%]"
                  label="Testning vaqtini kiriting!"
                  isRequired
                />
              </div>
              {questions.map((q, qIndex) => (
                <div key={qIndex}>
                  <Input
                    className="m-2 w-auto"
                    label={`Savol ${qIndex + 1}`}
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                    isRequired
                  />
                  {q.answers.map((answer, aIndex) => (
                    <Input
                      key={aIndex}
                      className="m-2 w-auto"
                      label={`Javob ${aIndex + 1}`}
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, aIndex, e.target.value)
                      }
                      isRequired
                    />
                  ))}
                  <Button onClick={() => addAnswer(qIndex)}>Add Answer</Button>
                </div>
              ))}
              <div className="relative">
                <Button
                  onClick={addQuestion}
                  className="mt-6 w-full sticky bottom-0 left-0 bg-blue-500"
                  color="primary"
                >
                  Add Question
                </Button>
              </div>
            </div>
          )}

          {active === "students" && (
            <div>
              <div className="p-4">
                {/* Tugmalar */}
                <div className="flex space-x-4 mb-4">
                  <Button color="primary" onClick={() => setFilter("group")}>
                    Groups
                  </Button>
                  <Button
                    color="success"
                    onClick={() => setFilter("course")}
                    className="text-white"
                  >
                    Course
                  </Button>
                  <Button onClick={() => setFilter("all")}>All</Button>
                </div>

                {/* Studentlar */}
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="border p-4 rounded shadow">
                      <div
                        className="cursor-pointer font-bold"
                        onClick={() =>
                          setSelectedStudentId(
                            selectedStudentId === student.id
                              ? null
                              : student.id,
                          )
                        }
                      >
                        {student.name} {student.surname}
                      </div>
                      {selectedStudentId === student.id && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold">Tests:</h4>
                          {student.tests.map((test, index) => (
                            <div key={index} className="mt-2">
                              <p className="font-medium">{test.question}</p>
                              <ul className="list-disc pl-5">
                                {test.answers.map((answer, i) => (
                                  <li
                                    key={i}
                                    className={`${
                                      answer === test.selectedAnswer
                                        ? "text-green-500"
                                        : ""
                                    }`}
                                  >
                                    {answer}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === "results" && <div>result</div>}
        </div>
      </div>
    </div>
  );
};

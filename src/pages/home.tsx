import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Button, Card, CardBody, Image, Spinner } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { api } from "../api";

interface ProfileData {
  data: {
    full_name: string;
    image: string;
    specialty: {
      name: string;
    };
  };
}

interface TestData {
  _id: string;
  title: string;
  description?: string;
  time?: number;
  questionsCount: number;
  questions?: Question[];
}

interface Option {
  variant: string;
  javob: string;
  _id: string;
}

interface Question {
  questionText: string;
  options: Option[];
  _id: string;
}

interface ActiveTest extends TestData {
  questions: Question[];
}

export const Home = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const handleTimeWarning = useCallback(() => {
    toast("Shoshiling, test tugashiga 1 minut qoldi!", {
      icon: "⏰",
    });
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/student/profile");
        setData(response.data);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Xatolik yuz berdi",
        );
      } finally {
        setLoading(false);
      }
    };

    const getTests = async () => {
      try {
        const response = await api.get("/student/test");
        setTests(response.data.data as TestData[]);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Xatolik yuz berdi",
        );
      }
    };

    getTests();
    getProfile();
  }, []);

  if (loading) {
    return (
      <Spinner
        size="lg"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    );
  }

  const handleLogout = async () => {
    localStorage.clear();
    await toast.success("Muvaffaqiyatli chiqildi!");
    window.location.href = "/";
  };

  const handleStartTest = async (testId: string) => {
    try {
      const response = await api.get(`/student/test/start/${testId}`);
      setActiveTest(response.data.data as ActiveTest);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Testni boshlashda xatolik yuz berdi",
      );
    }
  };

  const handleSelectAnswer = (questionId: string, variant: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: variant,
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;

    try {
      const answers = activeTest.questions.map((question) => ({
        questionNumber: question._id,
        selectedVariant: selectedAnswers[question.questionText] || null,
      }));

      await api.post(`/student/test/submit`, {
        testId: activeTest._id,
        answers,
      });
      await toast.success("Test yakunlandi!");
      setActiveTest(null);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Testni yakunlashda xatolik yuz berdi",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      {/* Header section */}
      <header className="w-full bg-white px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Test info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              {activeTest ? (
                <>
                  <MdOutlineDriveFileRenameOutline />
                  {activeTest.title}
                </>
              ) : (
                ""
              )}
            </h3>
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <IoIosPeople />
              {data?.data?.specialty.name}
            </h1>
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            {data?.data.image ? (
              <Image
                src={data.data.image}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle size={40} />
            )}
            <span className="font-semibold hidden sm:block">
              {data?.data?.full_name}
            </span>
            <Button
              size="sm"
              onClick={handleLogout}
              className="bg-red-500 text-white"
            >
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] bg-blue-500 p-4">
          <div className="flex justify-center mb-6">
            {data?.data.image ? (
              <Image
                src={data.data.image}
                isZoomed
                className="w-32 h-32 sm:w-48 sm:h-48 lg:w-[200px] lg:h-[200px]"
                radius="full"
              />
            ) : (
              <Image
                src="/public/user.png"
                isZoomed
                className="w-32 h-32 sm:w-48 sm:h-48 lg:w-[200px] lg:h-[200px]"
                radius="full"
              />
            )}
          </div>

          {/* Timer */}
          {activeTest && (
            <div className="max-w-xs mx-auto">
              <CountdownTimer
                initialMinutes={activeTest.time || 20}
                onTimeWarning={handleTimeWarning}
              />
            </div>
          )}
        </aside>

        {/* Quiz section */}
        <section className="flex-1 p-4 bg-blue-200">
          <Card className="h-full">
            <CardBody className="flex flex-col gap-6">
              {!activeTest ? (
                // Testlar ro'yxati
                tests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tests.map((test) => (
                      <div
                        key={test._id}
                        className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                          activeTest?.["_id"] === test._id
                            ? "border-blue-500 bg-blue-50"
                            : ""
                        }`}
                        onClick={() => handleStartTest(test._id)}
                      >
                        <h3 className="text-xl font-semibold text-blue-600 mb-3">
                          {test.title}
                        </h3>
                        {test.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {test.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{test.time || 0} daqiqa</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2"
                              />
                            </svg>
                            <span>{test.questionsCount} ta savol</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-lg font-semibold text-gray-500">
                      Hozircha test yo'q
                    </p>
                  </div>
                )
              ) : (
                // Test savollari
                <div className="max-w-2xl mx-auto w-full">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                      {activeTest.title}
                    </h2>
                    <p className="text-gray-600">{activeTest.description}</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">
                        Savol {currentQuestionIndex + 1} /{" "}
                        {activeTest.questions.length}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-6">
                      {activeTest.questions[currentQuestionIndex].questionText}
                    </h3>

                    <div className="space-y-4">
                      {activeTest?.questions[currentQuestionIndex]?.options.map(
                        (option) => {
                          return (
                            <div
                              key={option.variant}
                              onClick={() =>
                                handleSelectAnswer(
                                  activeTest.questions[currentQuestionIndex]
                                    .questionText,
                                  option.variant,
                                )
                              }
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedAnswers[
                                  activeTest.questions[currentQuestionIndex]
                                    .questionText
                                ] === option.variant
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-200"
                              }`}
                            >
                              <p>{option.javob}</p>
                            </div>
                          );
                        },
                      )}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button
                        color="primary"
                        variant="flat"
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                          setCurrentQuestionIndex((prev) => prev - 1)
                        }
                      >
                        Oldingi
                      </Button>

                      {currentQuestionIndex ===
                      activeTest.questions.length - 1 ? (
                        <Button
                          color="success"
                          onClick={handleSubmitTest}
                          disabled={
                            !selectedAnswers[
                              activeTest.questions[currentQuestionIndex]
                                .questionText
                            ]
                          }
                        >
                          Testni yakunlash
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          onClick={() =>
                            setCurrentQuestionIndex((prev) => prev + 1)
                          }
                          disabled={
                            !selectedAnswers[
                              activeTest.questions[currentQuestionIndex]
                                .questionText
                            ]
                          }
                        >
                          Keyingi
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </section>
      </main>
    </div>
  );
};

interface CountdownTimerProps {
  initialMinutes: number;
  onTimeWarning: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  onTimeWarning,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 60) {
          onTimeWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeWarning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center">
      <p className="text-lg font-semibold">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
};

import { Button, Image, Input } from "@nextui-org/react";
import { SiVitest } from "react-icons/si";
import { PiStudent } from "react-icons/pi";
import { MdDeleteOutline, MdQueuePlayNext, MdMenu } from "react-icons/md";
import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { CiEdit } from "react-icons/ci";

interface Option {
  variant: string;
  javob: string;
}

interface Question {
  questionText: string;
  options: Option[];
}

interface CreateTest {
  title: string;
  description: string;
  time: string;
  questions: Question[];
}

interface Answer {
  questionNumber: number;
  selectedVariant: string;
}

interface Student {
  first_name: string;
  second_name: string;
  third_name: string;
  full_name: string;
  image: string;
  group: {
    name: string;
  };
  faculty: {
    name: string;
  };
  level: {
    name: string;
  };
  address: string;
}

interface User {
  _id: string;
  login: string;
  student: Student;
}

interface StudentTest {
  _id: string;
  userId: string;
  testId: string;
  answers: Answer[];
  completionTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface GroupData {
  _id: string;
  name: string;
  answers: StudentTest[];
  count: number;
}

interface FilteredDataType {
  success: boolean;
  message: string;
  total: number;
  page: number;
  limit: number;
  data: GroupData[];
}

interface Test {
  _id: string;
  title: string;
  description?: string;
  time?: number;
  questions: Question[];
}

export const SuperAdminPage = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTest>();
  const rows = [
    { title: "Testlar", icon: <SiVitest />, nextPage: "tests" },
    { title: "Talabalar", icon: <PiStudent />, nextPage: "students" },
    { title: "Natijalar", icon: <MdQueuePlayNext />, nextPage: "results" },
  ];
  const [active, setActive] = useState<string>("tests");
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", options: [{ variant: "A", javob: "" }] },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [{ variant: "A", javob: "" }],
      },
    ]);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (data: CreateTest) => {
    setLoading(true);
    try {
      const response = await api.post("/admin/test/create", {
        title: data.title,
        description: data.description,
        time: Number(data.time),
        questions: data.questions.map((question) => ({
          questionText: question.questionText,
          options: question.options.map((option) => ({
            variant: option.variant,
            javob: option.javob,
          })),
        })),
      });

      setLoading(false);
      toast.success("Test muvaffaqiyatli yaratildi!");

      reset({
        title: "",
        description: "",
        time: "",
        questions: [
          { questionText: "", options: [{ variant: "A", javob: "" }] },
        ],
      });
      setQuestions([
        { questionText: "", options: [{ variant: "A", javob: "" }] },
      ]);

      return response.data;
    } catch (error: unknown) {
      setLoading(false);
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";

      toast.error(errorMessage);
      throw error;
    }
  };

  const [filteredData, setFilteredData] = useState<FilteredDataType>({
    success: false,
    message: "",
    total: 0,
    page: 1,
    limit: 10,
    data: [],
  });

  const answerGet = useCallback(async () => {
    if (active !== "results") return;

    setLoading(true);
    try {
      const response = await api.get("/admin/answer");
      setFilteredData(response.data);
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [active]);

  useEffect(() => {
    answerGet();
  }, [answerGet]);

  const [selectedStudent, setSelectedStudent] = useState<StudentTest | null>(
    null,
  );
  const [testName, setTestName] = useState<string | null>(null);

  const [tests, setTests] = useState<Test[]>([]);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);

  const getTests = async () => {
    try {
      const response = await api.get("/admin/test");
      setTests(response.data.data);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Testlarni yuklashda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    if (active === "tests") {
      getTests();
    }
  }, [active]);

  const handleEditTest = async (test: Test) => {
    try {
      const response = await api.get(`/admin/test/${test._id}`);
      const fullTest = response.data.data;

      setCurrentTest(fullTest);
      reset({
        title: fullTest.title,
        description: fullTest.description || "",
        time: fullTest.time ? fullTest.time.toString() : "",
        questions: fullTest.questions.map((question: Question) => ({
          questionText: question.questionText,
          options: question.options.map((option: Option) => ({
            variant: option.variant,
            javob: option.javob,
          })),
        })),
      });
    } catch (error) {
      console.error("Error fetching test details:", error);
      toast.error("Test tafsilotlarini yuklashda xatolik yuz berdi");
    }
  };

  const onSubmitEdit = async (data: CreateTest) => {
    if (!currentTest) return;

    try {
      await api.put(`/admin/test/${currentTest._id}`, {
        title: data.title,
        description: data.description,
        time: Number(data.time),
        questions: data.questions.map((question) => ({
          questionText: question.questionText,
          options: question.options.map((option) => ({
            variant: option.variant,
            javob: option.javob,
          })),
        })),
      });
      toast.success("Test muvaffaqiyatli tahrirlandi!");
      getTests();
    } catch (error) {
      console.error("Edit Error:", error);
      toast.error("Testni tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      await api.delete(`/admin/test/${testId}`);
      toast.success("Test muvaffaqiyatli o'chirildi");
      getTests();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Testni o'chirishda xatolik yuz berdi");
    }
  };

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleLogout = async () => {
    localStorage.clear();
    await toast.success("Muvaffaqiyatli chiqildi!");
    window.location.href = "/";
  };

  const handleStudentClick = async (student: StudentTest) => {
    setSelectedStudent(student);
    try {
      const response = await api.get(`/admin/test/${student.testId}`);
      setTestName(response.data.data.title);
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Test nomini olishda xatolik yuz berdi";
      toast.error(errorMessage);
    }
  };

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full h-12 flex justify-end items-center bg-white shadow-md">
        <h1 className="mr-5 font-semibold text-lg">Admin</h1>
        <Button
          size="sm"
          onClick={handleLogout}
          className="bg-red-500 text-white"
        >
          Chiqish
        </Button>
      </div>

      <div className="flex flex-1">
        <aside
          className={`${
            isSidebarExpanded ? "w-full md:w-[300px]" : "w-16"
          } bg-blue-500 p-4 transition-all duration-300`}
        >
          <div className="flex flex-col gap-4">
            <Button
              onClick={toggleSidebar}
              type="button"
              color="primary"
              className="mb-4"
              isIconOnly={!isSidebarExpanded}
            >
              <MdMenu size={24} />
            </Button>

            {rows.map((item, index) => (
              <Button
                onClick={() => {
                  setActive(item.nextPage);
                  setIsSidebarExpanded(false); // Collapse sidebar on item click
                }}
                key={index}
                type="button"
                color="primary"
                className={`${item.nextPage === active ? " border-b-1 border-orange-600" : ""} ${isSidebarExpanded ? "justify-start" : "justify-center"}`}
                // size="lg"
                variant="faded"
                isIconOnly={!isSidebarExpanded}
              >
                {item.icon}
                {isSidebarExpanded && item.title}
              </Button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-4 bg-blue-200 overflow-y-auto">
          {active === "tests" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mavjud Testlar</h2>
                <Button
                  color="primary"
                  onClick={() => {
                    setShowCreateForm(true);
                    reset({
                      title: "",
                      description: "",
                      time: "",
                      questions: [
                        {
                          questionText: "",
                          options: [{ variant: "", javob: "" }],
                        },
                      ],
                    });
                    setQuestions([
                      {
                        questionText: "",
                        options: [{ variant: "", javob: "" }],
                      },
                    ]);
                  }}
                >
                  + Yangi Test
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.map((test) => (
                  <div
                    key={test._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-blue-600 flex-1">
                        {test.title}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          color="warning"
                          size="sm"
                          onClick={() => handleEditTest(test)}
                        >
                          <CiEdit size={20} />
                        </Button>
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteTest(test._id)}
                        >
                          <MdDeleteOutline size={20} />
                        </Button>
                      </div>
                    </div>

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
                        <span>{test.questions.length} ta savol</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(showCreateForm || currentTest) && (
                <form
                  onSubmit={handleSubmit(currentTest ? onSubmitEdit : onSubmit)}
                  className="mt-6"
                >
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                      <Controller
                        name="title"
                        control={control}
                        rules={{
                          required: "Testning nomini kiriting!",
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label={"Testning nomini kiriting!"}
                            size="sm"
                            isInvalid={Boolean(errors.title?.message)}
                            className="m-2 w-full md:max-w-[48%]"
                            isRequired
                            errorMessage={errors.title?.message as string}
                          />
                        )}
                      />
                      <Controller
                        name="time"
                        control={control}
                        rules={{
                          required: "Testning vaqtini kiriting!",
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label={"Testning vaqtini kiriting!"}
                            size="sm"
                            isInvalid={Boolean(errors.time?.message)}
                            className="m-2 w-full md:max-w-[48%]"
                            isRequired
                            errorMessage={errors.time?.message as string}
                          />
                        )}
                      />
                    </div>
                    <Controller
                      name="description"
                      control={control}
                      rules={{
                        required: "Testning tavsifini kiriting!",
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={"Testning tavsifini kiriting!"}
                          size="sm"
                          isInvalid={Boolean(errors.description?.message)}
                          className="m-2 w-full"
                          isRequired
                          errorMessage={errors.description?.message as string}
                        />
                      )}
                    />
                    {questions.map((q, qIndex) => (
                      <div key={qIndex} className="mb-4">
                        <Controller
                          name={`questions.${qIndex}.questionText`}
                          control={control}
                          rules={{
                            required: "Savolni kiriting!",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              label={`Savol ${qIndex + 1}`}
                              size="sm"
                              isInvalid={Boolean(
                                errors.questions?.[qIndex]?.questionText
                                  ?.message,
                              )}
                              className="m-2 w-full"
                              isRequired
                              errorMessage={
                                errors.questions?.[qIndex]?.questionText
                                  ?.message as string
                              }
                            />
                          )}
                        />
                        {q.options.map((_, aIndex) => (
                          <div key={aIndex} className="flex gap-2">
                            <Controller
                              name={`questions.${qIndex}.options.${aIndex}.variant`}
                              control={control}
                              rules={{
                                required: "Variant harfini kiriting!",
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  label={`Variant`}
                                  size="sm"
                                  className="m-2 w-[100px]"
                                  isInvalid={Boolean(
                                    errors.questions?.[qIndex]?.options?.[
                                      aIndex
                                    ]?.variant?.message,
                                  )}
                                  isRequired
                                  errorMessage={
                                    errors.questions?.[qIndex]?.options?.[
                                      aIndex
                                    ]?.variant?.message as string
                                  }
                                />
                              )}
                            />
                            <Controller
                              name={`questions.${qIndex}.options.${aIndex}.javob`}
                              control={control}
                              rules={{
                                required: "Javobni kiriting!",
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  label={`Javob ${aIndex + 1}`}
                                  size="sm"
                                  className="m-2 flex-1"
                                  isInvalid={Boolean(
                                    errors.questions?.[qIndex]?.options?.[
                                      aIndex
                                    ]?.javob?.message,
                                  )}
                                  isRequired
                                  errorMessage={
                                    errors.questions?.[qIndex]?.options?.[
                                      aIndex
                                    ]?.javob?.message as string
                                  }
                                />
                              )}
                            />
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            const newQuestions = [...questions];
                            newQuestions[qIndex].options.push({
                              variant: String.fromCharCode(
                                65 + newQuestions[qIndex].options.length,
                              ),
                              javob: "",
                            });
                            setQuestions(newQuestions);
                          }}
                        >
                          Javob qo'shish
                        </Button>
                      </div>
                    ))}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <Button
                        onClick={addQuestion}
                        className="mt-6 w-full md:w-[20%]"
                        color="primary"
                      >
                        Savol qo'shish
                      </Button>
                      <Button
                        isLoading={loading}
                        type="submit"
                        className="mt-6 w-full"
                        color="success"
                      >
                        {currentTest
                          ? "Tahrirlashni Saqlash"
                          : "Savollarni Yuborish"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {active === "students" && (
            <div>
              <div className="p-4">
                <div className="flex space-x-4 mb-4">
                  <Button color="primary">Gurpalar</Button>
                  <Button color="success" className="text-white">
                    Studentlar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {active === "results" && (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-6">Test Natijalari</h2>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredData.data?.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  Hozircha natijalar mavjud emas
                </div>
              ) : (
                <>
                  <div className="space-y-6 h-auto">
                    {filteredData.data?.map((group) => (
                      <div key={group._id || "no-group"}>
                        <h3 className="font-bold text-xl mb-4">
                          {group._id
                            ? `${group._id} Guruhi`
                            : "Guruh mavjud emas"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.answers.map((student: StudentTest) => (
                            <div
                              key={student._id}
                              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => handleStudentClick(student)}
                            >
                              <div className="flex items-center space-x-4">
                                <Image
                                  src={
                                    student.user.student.image
                                      ? student.user.student.image
                                      : "/public/user.png"
                                  }
                                  alt={student.user.student.full_name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    {student.user.student.full_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {student.user.student.group.name} guruh
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Test topshirilgan vaqt:{" "}
                                    {new Date(
                                      student.completionTime,
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedStudent && (
                    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white h-auto rounded-lg max-w-[90%] md:max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh]">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-4">
                            <Image
                              src={
                                selectedStudent.user.student.image
                                  ? selectedStudent.user.student.image
                                  : "/public/user.png"
                              }
                              alt={selectedStudent.user.student.full_name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="text-xl font-bold">
                                {selectedStudent.user.student.full_name}
                              </h3>
                              <p className="text-gray-600">
                                {selectedStudent.user.student.faculty.name}
                              </p>
                              <p className="text-gray-600">
                                {selectedStudent.user.student.group.name} guruh,{" "}
                                {selectedStudent.user.student.level.name}
                                <p className="text-sm text-gray-600">
                                  {selectedStudent.user.student.address}
                                </p>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedStudent(null);
                              setTestName(null);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-semibold mb-2">
                            Test nomi: {testName}
                          </h4>
                          <div className="space-y-2 min-h-[500px] border p-2 rounded overflow-y-hidden">
                            {selectedStudent.answers.map((answer, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-2 rounded"
                              >
                                <span>Savol {answer.questionNumber}</span>
                                <span className="font-medium">
                                  Javob: {answer.selectedVariant}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                          <p>
                            Test topshirilgan vaqt:{" "}
                            {new Date(
                              selectedStudent.completionTime,
                            ).toLocaleString()}
                          </p>
                          <p>Status: {selectedStudent.status}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

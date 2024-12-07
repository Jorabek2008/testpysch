import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Button, Card, CardBody, Image, Spinner } from "@nextui-org/react";
import { CountdownTimer, QuestionNumber, Quiz } from "../components";
import { MockdataTest } from "../mock";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
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

export const Home = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      {/* Header section */}
      <header className="w-full bg-white px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Test info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <MdOutlineDriveFileRenameOutline />
              Temperament aniqlash
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
          <div className="max-w-xs mx-auto">
            <CountdownTimer initialMinutes={20} />
          </div>
        </aside>

        {/* Quiz section */}
        <section className="flex-1 p-4 bg-blue-200">
          <Card className="h-full">
            <CardBody className="flex flex-col gap-6">
              <div className="flex justify-center">
                <QuestionNumber question={MockdataTest.length} />
              </div>
              <Quiz data={MockdataTest} />
            </CardBody>
          </Card>
        </section>
      </main>
    </div>
  );
};

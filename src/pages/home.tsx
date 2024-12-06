import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Card, CardBody, Image } from "@nextui-org/react";
import { CountdownTimer, QuestionNumber, Quiz } from "../components";
import { MockdataTest } from "../mock";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { api } from "../api";

interface ProfileData {
  data: {
    full_name: string;
    image: string;
    // add other expected properties
  };
}

export const Home = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const getProfile = async () => {
    try {
      const response = await api.get("/client/profile");

      setData(response.data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi");
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  console.log(data?.data);
  return (
    <div>
      <Toaster />
      {/* home top section */}
      <div className="w-full bg-white px-4 py-2 600px:flex justify-between items-center">
        <div className="800px:flex flex-wrap items-center gap-10">
          <h1 className="flex justify-center 600px:justify-normal">
            Oliy Test Tizimi
          </h1>
          {/* Test nomi */}
          <h3 className="flex justify-center 600px:justify-normal flex-wrap items-center gap-2 text-large font-semibold">
            <MdOutlineDriveFileRenameOutline />
            Temperament aniqlash
          </h3>
          {/* test bajaruvchini guruhi */}
          <h1 className="flex justify-center 600px:justify-normal flex-wrap items-center gap-2 text-large font-semibold">
            <IoIosPeople />
            913-19
          </h1>
        </div>

        {/* foydalanuvchi ma'lumoti va rasmi */}
        <div className="flex justify-center 600px:justify-normal flex-wrap items-center gap-4">
          {data?.data.image ? (
            <Image
              src={data.data.image}
              className="rounded-full w-[40px] h-[40px] object-cover"
            />
          ) : (
            <FaUserCircle size={40} />
          )}
          <h1 className="flex flex-wrap items-center gap-2 font-semibold">
            {data?.data?.full_name}
          </h1>
        </div>
      </div>

      {/* home main section */}
      <div className="flex h-screen">
        <div className="w-[300px] bg-blue-500">
          <div className="flex justify-center mt-3">
            {data?.data.image ? (
              <Image
                src={data.data.image}
                isZoomed
                className="w-[200px] h-[200px]"
                radius="full"
              />
            ) : (
              <Image
                src="/public/user.png"
                isZoomed
                className="w-[200px] h-[200px]"
                radius="full"
              />
            )}
          </div>

          {/* sekundnomer */}
          <CountdownTimer initialMinutes={20} />
        </div>
        <div className="w-full bg-blue-200 p-2">
          <Card>
            <CardBody>
              <div className=" flex justify-center">
                <div>
                  <QuestionNumber question={MockdataTest.length} />
                </div>
              </div>
              <Quiz data={MockdataTest} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

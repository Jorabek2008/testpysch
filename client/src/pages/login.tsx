import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../api";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  login: string;
  password: string;
}

export const Login = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>();
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        login: data.login,
        password: data.password,
      });
      setLoading(false);
      toast.success("Login muvaffaqiyatli!");
      const token = response.data.token;

      // Tokenni localStorage ga saqlash
      localStorage.setItem("token", token);

      navigate("/home");
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

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <div className="">
      <Toaster />
      <div className="bg-bg_img w-full h-screen bg-no-repeat bg-center bg-cover relative">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="absolute top-1/2 left-1/2 transform overflow-hidden -translate-x-1/2 -translate-y-1/2">
          <Card className="py-4 mx-auto">
            <CardHeader className="pb-0 py-2 text-center px-4">
              <h4 className="font-bold text-xl mx-auto">Psixologiya testi</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* login */}
                <Controller
                  name="login"
                  control={control}
                  rules={{
                    required: "Loginni kiriting!",
                    pattern: {
                      value: /^\d+$/,
                      message: "Faqat raqam kiriting",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={"Login"}
                      type="number"
                      size="sm"
                      variant="bordered"
                      isInvalid={Boolean(errors.login?.message)}
                      className="400px:w-[300px] min-w-[200px]"
                      isRequired
                      errorMessage={errors.login?.message as string}
                    />
                  )}
                />

                {/* password */}

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Parolni kiriting!",
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Parol"
                      variant="bordered"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                          aria-label="toggle password visibility"
                        >
                          {isVisible ? (
                            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <FaEye className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                      className="max-w-xs mt-3 mb-6"
                      isInvalid={Boolean(errors.password?.message)}
                      errorMessage={errors.password?.message as string}
                    />
                  )}
                />

                <Button
                  color="primary"
                  isLoading={loading}
                  // onClick={}
                  type="submit"
                  className="w-full"
                >
                  Kirish
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

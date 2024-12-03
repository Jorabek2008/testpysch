import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Login = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <div className="">
      <div className="bg-bg_img w-full h-screen bg-no-repeat bg-center bg-cover relative">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="absolute top-1/2 left-1/2 transform overflow-hidden -translate-x-1/2 -translate-y-1/2">
          <Card className="py-4 mx-auto">
            <CardHeader className="pb-0 py-2 text-center px-4">
              <h4 className="font-bold text-xl mx-auto">Psixologiya testi</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Input
                label={"Ismingiz"}
                size="sm"
                variant="bordered"
                className="400px:w-[300px] min-w-[200px]"
                isRequired
              />
              <Input
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
              />
              <Button color="primary" onClick={() => location.replace("/home")}>
                Kirish
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

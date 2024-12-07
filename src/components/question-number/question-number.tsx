import { Pagination, PaginationItemRenderProps } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface ProtoQuestionProps {
  question: number;
}

export const QuestionNumber: React.FC<ProtoQuestionProps> = ({ question }) => {
  const { number } = useSelector((state: RootState) => state.stepReducer);
  const [activePage, setActivePage] = useState<number>(number);

  useEffect(() => {
    setActivePage(number);
  }, [number]);

  const handlePageChange = (newPage: number) => {
    setActivePage(newPage);
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div className="flex flex-wrap justify-center gap-2 p-2 min-w-[300px]">
        <Pagination
          total={question}
          page={activePage}
          onChange={handlePageChange}
          className="flex flex-wrap justify-center"
          renderItem={(props: PaginationItemRenderProps) => (
            <button
              key={props.value}
              disabled={props.value !== activePage}
              className={`
                px-2 sm:px-4 py-2 m-1
                rounded-md text-sm sm:text-base
                transition-colors duration-200
                ${
                  props.value === activePage
                    ? "bg-blue-500 text-white cursor-default"
                    : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                }
                disabled:opacity-50
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              {props.value === "dots" ? "..." : props.value}
            </button>
          )}
        />
      </div>
    </div>
  );
};

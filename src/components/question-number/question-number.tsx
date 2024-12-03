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
    <div>
      <Pagination
        total={question}
        page={activePage}
        onChange={handlePageChange}
        renderItem={(props: PaginationItemRenderProps) => (
          <button
            key={props.value}
            disabled={props.value !== activePage}
            style={{
              padding: "10px 20px",
              margin: "5px",
              cursor: props.value === activePage ? "default" : "pointer",
              background: props.value === activePage ? "#0070f3" : "#eaeaea",
              color: props.value === activePage ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {props.value == "dots" ? "..." : props.value}
          </button>
        )}
      />
    </div>
  );
};

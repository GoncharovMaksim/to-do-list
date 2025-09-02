import { render, screen } from "@testing-library/react";
import App from "@/app/page";

describe("ToDo App", () => {
  test("рендерится поле ввода и кнопка", () => {
    render(<App />);
    expect(
      screen.getByPlaceholderText("Фильтр/Новая запись")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /добавить/i })
    ).toBeInTheDocument();
  });
});

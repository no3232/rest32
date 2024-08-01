import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import * as ButtonStories from "./Button.stories";
import { expect } from "@storybook/test";

const { Primary } = composeStories(ButtonStories);

it("render test", () => {
  const { getByText } = render(<Primary />);
  expect(getByText("test")).toBeInTheDocument();
});

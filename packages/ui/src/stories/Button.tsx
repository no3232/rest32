import React from "react";
import "./button.css";

interface ButtonProps {
  /**
   * 이거 프라이머리인지 확인하는 불리언값
   */
  primary?: boolean;
  /**
   * 백그라운드 컬러 지정
   */
  backgroundColor?: string;
  /**
   * 크기 지정
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  label: string;
  /**
   * 클릭전달하는 함수여!
   */
  onClick?: () => void;
}

/**
 * 버틎ㄴ버ㅓㄴ야ㅐㅔㅁ루ㅐㅣㅑㄴ듀ㅜㄹ먀ㅐㅠㄷ
 */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  return (
    <button
      type="button"
      className={["storybook-button", `storybook-button--${size}`, mode].join(
        " ",
      )}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

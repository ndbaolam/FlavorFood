import { Button } from "@material-tailwind/react";

interface ButtonDefaultProps {
  text: string;
}

export function ButtonDefault({ text }: ButtonDefaultProps) {
  return <Button>{text}</Button>;
}

import { twMerge } from "tailwind-merge";

const Card = ({children, className}) => {
  return (
    <div className={twMerge("rounded-lg bg-white w-full border border-gray-300", className)}
    >{children}</div>
  )
}

export default Card;
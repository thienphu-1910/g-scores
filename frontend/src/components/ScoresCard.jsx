import { twMerge } from "tailwind-merge"


const ScoresCard = ({ title, value, className="" }) => {
  return (
    <div className="flex flex-col justify-center items-start">
      <label htmlFor="#title" className="text-black text-sm font-semibold">{title}</label>
      <input
        className={twMerge("px-2 py-1 text-center rounded-lg bg-gray-300 text-xs font-normal text-black", className)}
        id="#title"
        value={value}
        readOnly
      />
    </div>
  )
}

export default ScoresCard
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Rating({ value, text }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} className="text-yellow-400">
          {value >= index ? <FaStar /> : value >= index - 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>
      ))}
      {text && <span className="text-xs text-gray-400 ml-2 font-bold uppercase">{text}</span>}
    </div>
  );
}
export default Rating;

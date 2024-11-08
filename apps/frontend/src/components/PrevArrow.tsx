import { ChevronLeft } from 'lucide-react';

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all"
    >
      <ChevronLeft className="w-6 h-6 text-gray-800" />
    </button>
  );
};

export default PrevArrow;

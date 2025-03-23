import { ChefHat } from 'lucide-react';
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { TipsItem } from '../Tip.interface';
import axiosInstance from "../../../services/axiosInstance";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  const id = slug?.slice(slug?.search("_") + 1);
  console.log('Fetching URL:', `/tips/${id}`);

  try {
    const response = await axiosInstance.get<TipsItem>(`/tips/${id}`);
    console.log('Response Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tip data:', error);
    throw new Response('Error fetching tip data', { status: 500 });
  }
}

const TipDetails: React.FC = () => {
  const tips = useLoaderData() as TipsItem;


  return (
    <div className='min-h-screen py-12 bg-gray-50'>
      <main className='container mx-auto px-6 md:px-12'>
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">{tips.title}</h1>
        
        {/* Hình ảnh */}
        <div className="w-full flex justify-center mt-4">
          <img
            src={tips.thumbnail}
            alt={""}
            className=" w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Nội dung */}
        <div className="w-full text-gray-700 mt-6">
          <div className="leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: tips.content.replace(/(\d+\.\s[^<]+)/g, '<strong>$1</strong>') }} />
        </div>
      </main>
    </div>
  );
}

export default TipDetails;
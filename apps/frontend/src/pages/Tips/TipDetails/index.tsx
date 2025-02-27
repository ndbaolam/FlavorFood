import { ChefHat } from 'lucide-react';
import formatString from '../../../services/formatString';

import { Link, LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
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

  if(!tips || Object.keys(tips).length === 0){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold text-red-500 mb-4">Không tìm thấy mẹo nhà bếp</h1>
        <p className="text-gray-600 mb-4">
          Chúng tôi không thể tìm thấy mẹo nhà bếp bạn yêu cầu.
        </p>
        <Link to="/dish" className="text-blue-500 hover:underline hover:text-blue-700">
          Quay lại tất cả.
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen py-12 bg-white'>
      <main className='container mx-auto px-4'>
        <article>
          <div className='text-left flex flex-wrap items-center gap-20'>
            <h1 className='text-3xl font-bold mb-4'>{tips.title}</h1>
            
            <div className='flex items-center gap-2 mb-4'>
              <ChefHat className="w-6 h-6 text-black"/>
              {tips.genres.length > 0 ? (
                tips.genres.map((genre) => (
                  <span key={genre.genre_id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {genre.title}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Không có thể loại</span>
              )}
            </div>
          </div>

          <div className="flex justify-between w-fit mt-12">
            <img 
              src={tips.thumbnail}
              alt={tips.title}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>

          <div className='mt-12'>
            <p className='text-black'>{tips.content}</p>
          </div>
        </article>
      </main>
    </div>
  );
}

export default TipDetails;
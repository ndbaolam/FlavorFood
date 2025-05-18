import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
import { TipsItem } from '../tip.interface';
import axiosInstance from "../../../services/axiosInstance";
import { CircleArrowLeft } from "lucide-react";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  try {
    const { slug } = params;
    const id = slug?.slice(slug?.search("_") + 1);
    
    const response = await axiosInstance.get<TipsItem>(`/tips/${id}`);
    return response.data;
  } catch (error) {
    throw new Response('Error fetching tip data', { status: 500 });
  }
}

const TipDetails: React.FC = () => {
  const navigate = useNavigate();
  const tip = useLoaderData() as TipsItem;

  return (
    <div className="min-h-screen py-12 bg-white">
      <main className="container mx-auto px-6 md:px-12">
        <div className=" p-8">
          <div className="flex items-center mb-8 relative">
            <button
              onClick={() => navigate(-1)}
              className="text-black hover:text-blue-500 transition duration-300 absolute left-0"
              aria-label="Go back"
            >
              <CircleArrowLeft className="w-7 h-7" />
            </button>
            
            <h1 className="text-4xl font-extrabold text-center text-gray-800 w-full">
              {tip.title}
            </h1>
          </div>
        
          <div className="w-full mb-8 mt-8 ">
            <img
              src={tip.thumbnail}
              alt={tip.title}
              className="w-full h-96 rounded-lg shadow-lg object-cover"
            />
          </div>

          <div 
            className="prose max-w-none lg:prose-lg"
            dangerouslySetInnerHTML={{ __html: tip.content }}
          />
        </div>
      </main>
    </div>
  );
};

export default TipDetails;
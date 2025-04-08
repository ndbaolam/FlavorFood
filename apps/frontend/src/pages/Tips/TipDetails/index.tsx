import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { TipsItem } from '../tip.interface';
import axiosInstance from "../../../services/axiosInstance";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  const id = slug?.slice(slug?.search("_") + 1);

  try {
    const response = await axiosInstance.get<TipsItem>(`/tips/${id}`);
    return response.data;
  } catch (error) {
    throw new Response('Error fetching tip data', { status: 500 });
  }
}

const TipDetails: React.FC = () => {
  const tips = useLoaderData() as TipsItem;

  return (
    <div className='min-h-screen py-12 bg-white'>
     <main className='container mx-auto px-6 md:px-12 bg-gray-100 rounded-2xl shadow-lg p-6'>
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">{tips.title}</h1>
        <div className="w-full flex justify-center mb-6">
          <img
            src={tips.thumbnail}
            alt={tips.title}
            className="w-full lg:w-2/3 h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
        <div
          className="w-full text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: tips.content }}
        />
      </main>
    </div>
  );
};

export default TipDetails;

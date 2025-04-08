import { TipsItem } from "apps/frontend/src/pages/Tips/tip.interface";
import { X } from "lucide-react";
import React from "react";

interface TipDetailPopupProps {
    tip: TipsItem;
    onClose: () => void;
}

const TipDetailPopup: React.FC<TipDetailPopupProps> = ({ tip, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 max-w-6xl overflow-y-auto max-h-[90vh] ml-44">
                <article>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">{tip.title}</h1>
                        <button onClick={onClose} className="text-black  font-bold text-2xl">
                            <X size={36} />
                        </button>
                    </div>
                    <div className="w-full flex justify-center mb-6">
                        <img
                            src={tip.thumbnail}
                            alt={tip.title}
                            className="w-full lg:w-2/3 h-auto rounded-lg shadow-lg object-cover"
                        />
                    </div>
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: tip.content }}
                    />
                </article>
            </div>
        </div>
    );
};

export default TipDetailPopup;

function setFormErrors(errors: { [key: string]: string; }) {
    throw new Error("Function not implemented.");
}

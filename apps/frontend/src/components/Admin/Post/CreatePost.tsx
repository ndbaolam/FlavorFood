import { toast } from "react-toastify";
import { Recipe, Ingredient, Category, Step, Nutrition } from "../../../pages/Meals/recipe.interface";
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import imageCompression from "browser-image-compression";
import axiosInstance from "../../../services/axiosInstance";

interface CreatePostProps {
  initialData?: Recipe;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isEditing?: boolean;
}

const CategoryDropdown: React.FC<{
  categories: Category[];
  selectedCategoryIds: number[];
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<number[]>>;
  formErrors: { [key: string]: string };
}> = ({
  categories,
  selectedCategoryIds,
  setSelectedCategoryIds,
  formErrors
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const selectedCategoryLabels = categories
      .filter(cat => selectedCategoryIds.includes(cat.category_id))
      .map(cat => cat.title);

    return (
      <div className="mb-4" ref={dropdownRef}>
        <label className="block font-medium mb-1">
          Danh mục <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          {/* Dropdown button */}
          <button
            type="button"
            className="flex justify-between items-center w-full p-2 border rounded-lg bg-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">
              {selectedCategoryLabels.length > 0
                ? selectedCategoryLabels.join(', ')
                : 'Chọn danh mục'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown options */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.category_id} className="flex items-center p-2 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    id={`category-${category.category_id}`}
                    value={category.category_id}
                    checked={selectedCategoryIds.includes(category.category_id)}
                    onChange={(e) => {
                      const categoryId = Number(e.target.value);
                      setSelectedCategoryIds((prev) =>
                        e.target.checked
                          ? [...prev, categoryId]
                          : prev.filter((id) => id !== categoryId)
                      );
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`category-${category.category_id}`}
                    className="w-full cursor-pointer"
                  >
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {formErrors?.category && (
          <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
        )}
      </div>
    );
  };

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onSubmit, initialData, isEditing }) => {
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [time, setTime] = useState<number>(initialData?.time || 0);
  const [serving, setServing] = useState<number>(initialData?.serving || 0);
  const [image, setImage] = useState<string>(initialData?.image || "");
  const [difficulty, setDifficulty] = useState<Recipe["difficulty_level"]>(initialData?.difficulty_level || "Dễ");
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialData?.ingredients || []);
  const [steps, setSteps] = useState<Step[]>(initialData?.steps || []);
  const [nutrition, setNutrition] = useState<Nutrition[]>(initialData?.nutrition || []);
  const [timeError, setTimeError] = useState('');
  const [servingError, setServingError] = useState('');
  const [newStep, setNewStep] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        toast.error("Không thể tải danh mục");
      }
    };

    fetchCategories();
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setTime(value === '' ? 0 : Number(value));
    setTimeError('');
  };

  const handleServingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setServing(value === '' ? 0 : Number(value));
    setServingError('');
  };

  const handleTimeBlur = () => {
    if (time <= 0 || isNaN(time)) {
      setTime(0);
      setTimeError('Thời gian phải lớn hơn 0.');
    }
  };

  const handleServingBlur = () => {
    if (serving <= 0 || isNaN(serving)) {
      setServing(0);
      setServingError('Khẩu phần phải lớn hơn 0.');
    }
  };

  const validateForm = (): boolean => {
    let errors: { [key: string]: string } = {};

    if (!title.trim()) {
      errors.title = "Tên món ăn là bắt buộc.";
    }
    if (!description.trim()) {
      errors.description = "Mô tả là bắt buộc.";
    }
    if (time <= 0 || isNaN(time)) {
      errors.time = "Thời gian phải lớn hơn 0.";
    }
    if (serving <= 0 || isNaN(serving)) {
      errors.serving = "Khẩu phần phải lớn hơn 0.";
    }
    if (!image.trim()) {
      errors.image = "URL hình ảnh là bắt buộc.";
    }
    if (ingredients.length === 0) {
      errors.ingredients = "Nguyên liệu là bắt buộc.";
    }
    if (steps.length === 0) {
      errors.steps = "Các bước thực hiện là bắt buộc.";
    }
    if (selectedCategoryIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục.");
      errors.category = "Danh mục là bắt buộc.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      const form = new FormData();
      form.append("image", compressedFile);

      const response = await axiosInstance.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      const imageUrl = response.data.url;
      setImage(imageUrl);

      toast.success("Tải ảnh thành công!", { autoClose: 2000 });
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      toast.error("Lỗi tải ảnh!", { autoClose: 2000 });
    }
  };


  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setTime(initialData.time);
      setServing(initialData.serving);
      setImage(initialData.image);
      setDifficulty(initialData.difficulty_level);
      setIngredients(initialData.ingredients);
      setSteps(initialData.steps);
      setNutrition(initialData.nutrition);
      if (initialData.categories && initialData.categories.length > 0) {
        setSelectedCategoryIds(initialData.categories.map(category => category.category_id));
      }
    }
  }, [initialData]);



  const handleSubmit = () => {
    if (validateForm()) {
      const newRecipe = {
        recipe_id: initialData?.recipe_id || Date.now(),
        title,
        description,
        time,
        serving,
        image,
        difficulty_level: difficulty,
        ingredients,
        steps,
        categories: selectedCategoryIds,
        nutrition,
        rating: initialData?.rating ? initialData.rating : 0,
        isFavorite: initialData?.isFavorite || false,
      };

      console.log("Dữ liệu newRecipe trước khi gửi:", newRecipe);
      onSubmit(newRecipe);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 max-w-5xl overflow-y-auto max-h-[90vh] ml-32">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-grow text-center">
            <h2 className="text-3xl font-semibold text-black">{isEditing ? "Sửa công thức" : "Tạo công thức"}</h2>
          </div>
          <button onClick={onClose} className="text-black font-bold text-2xl">
            <X size={36} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">

          <div>
            <label className="block font-medium">Tên món ăn  <span className="text-red-500">* </span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-lg p-2 w-full min-h-[40px]" />
            {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
          </div>
          <div>
            <label className="block font-medium">Hình ảnh  <span className="text-red-500">* </span></label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  value="url"
                  checked={imageInputType === "url"}
                  onChange={() => setImageInputType("url")}
                />
                URL
              </label>
              <label>
                <input
                  type="radio"
                  value="file"
                  checked={imageInputType === "file"}
                  onChange={() => setImageInputType("file")}
                />
                Tải ảnh lên
              </label>
            </div>
            {imageInputType === "url" ? (
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="border rounded-lg p-2 w-full min-h-[40px] mt-2"
                placeholder="Nhập URL hình ảnh"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-lg p-2 w-full min-h-[40px] mt-2"
              />
            )}
            {formErrors.image && <p className="text-red-500">{formErrors.image}</p>}
            {image && <img src={image} alt="Preview" className="mt-2 max-w-full max-h-40" />}
          </div>

          <div>
            <label className="block font-medium">Mô tả <span className="text-red-500">* </span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded-lg p-2 w-full h-20" />
            {formErrors.description && <p className="text-red-500">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Thời gian (phút)  <span className="text-red-500">* </span></label>
              <input
                type="number"
                value={time === 0 ? "" : time}
                onChange={handleTimeChange}
                onBlur={handleTimeBlur}
                className="border rounded-lg p-2 w-full min-h-[40px]"
              />
              {timeError && <p className="text-red-500">{timeError}</p>}
              {formErrors.time && <p className="text-red-500">{formErrors.time}</p>}
            </div>
            <div>
              <label className="block font-medium">Khẩu phần (người) <span className="text-red-500">* </span></label>
              <input
                type="number"
                value={serving === 0 ? "" : serving}
                onChange={handleServingChange}
                onBlur={handleServingBlur}
                className="border rounded-lg p-2 w-full min-h-[40px]"
              />
              {servingError && <p className="text-red-500">{servingError}</p>}
              {formErrors.serving && <p className="text-red-500">{formErrors.serving}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Độ khó  <span className="text-red-500">* </span></label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Recipe["difficulty_level"])}
                className="border rounded-lg p-2 w-full min-h-[40px]"
              >
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
              </select>
            </div>


            <CategoryDropdown
              categories={categories}
              selectedCategoryIds={selectedCategoryIds}
              setSelectedCategoryIds={setSelectedCategoryIds}
              formErrors={formErrors}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Nguyên liệu  <span className="text-red-500">* </span></label>
              <ul>
                {ingredients.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span onClick={() => {
                      const editedIngredient = prompt(
                        "Chỉnh sửa nguyên liệu (Tên - Số lượng - Đơn vị)",
                        `${item.ingredient} - ${item.quantity} ${item.unit}`
                      );
                      if (editedIngredient) {
                        const parts = editedIngredient.split("-").map((p) => p.trim());
                        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                          const [ingredient, quantity, unit] = parts;
                          if (!isNaN(Number(quantity))) {
                            const updatedIngredients = [...ingredients];
                            updatedIngredients[index] = {
                              ...item,
                              ingredient,
                              quantity: Number(quantity),
                              unit,
                            };
                            setIngredients(updatedIngredients);
                          } else {
                            alert("Số lượng phải là số hợp lệ!");
                          }
                        } else {
                          alert("Vui lòng nhập đúng định dạng: Tên - Số lượng - Đơn vị");
                        }
                      }
                    }} style={{ cursor: 'pointer' }}>
                      {item.ingredient} - {item.quantity} {item.unit}
                    </span>
                    <div>
                      <button
                        onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                        className="text-red-500 px-2"
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Tên - Số lượng - Đơn vị"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    const parts = e.currentTarget.value.split("-").map((p) => p.trim());
                    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                      const [ingredient, quantity, unit] = parts;
                      if (!isNaN(Number(quantity))) {
                        setIngredients([
                          ...ingredients,
                          { id: Date.now(), ingredient, quantity: Number(quantity), unit },
                        ]);
                        e.currentTarget.value = "";
                      } else {
                        alert("Số lượng phải là số hợp lệ!");
                      }
                    } else {
                      alert("Vui lòng nhập đúng định dạng: Tên - Lượng - Đơn vị. Nhấn Enter để thêm thành phần khác");
                    }
                  }
                }}
                className="border rounded-lg p-2 w-full mt-2"
              />
              {formErrors.ingredients && <p className="text-red-500">{formErrors.ingredients}</p>}
            </div>

            <div>
              <label className="block font-medium">Thành phần dinh dưỡng</label>
              <ul>
                {nutrition.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span onClick={() => {
                      const editedNutrition = prompt(
                        "Chỉnh sửa thành phần dinh dưỡng (Tên - Lượng - Đơn vị)",
                        `${item.name} - ${item.amount} ${item.unit}`
                      );
                      if (editedNutrition) {
                        const parts = editedNutrition.split("-").map((p) => p.trim());
                        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                          const [name, amount, unit] = parts;
                          if (!isNaN(Number(amount))) {
                            const updatedNutrition = [...nutrition];
                            updatedNutrition[index] = {
                              ...item,
                              name,
                              amount: Number(amount),
                              unit,
                            };
                            setNutrition(updatedNutrition);
                          } else {
                            alert("Lượng phải là số hợp lệ!");
                          }
                        } else {
                          alert("Vui lòng nhập đúng định dạng: Tên - Lượng - Đơn vị. Nhấn Enter để thêm dinh dưỡng khác");
                        }
                      }
                    }} style={{ cursor: 'pointer' }}>
                      {item.name} - {item.amount} {item.unit}
                    </span>
                    <div>
                      <button
                        onClick={() => setNutrition(nutrition.filter((_, i) => i !== index))}
                        className="text-red-500 px-2"
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Tên - Lượng - Đơn vị"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    const parts = e.currentTarget.value.split("-").map((p) => p.trim());
                    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                      const [name, amount, unit] = parts;
                      if (!isNaN(Number(amount))) {
                        setNutrition([
                          ...nutrition,
                          { id: Date.now(), name, amount: Number(amount), unit },
                        ]);
                        e.currentTarget.value = "";
                      } else {
                        alert("Lượng phải là số hợp lệ!");
                      }
                    } else {
                      alert("Vui lòng nhập đúng định dạng: Tên - Lượng - Đơn vị");
                    }
                  }
                }}
                className="border rounded-lg p-2 w-full mt-2"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Các bước thực hiện  <span className="text-red-500">* </span></label>
            <ul>
              {steps
                .slice() // tạo bản sao để không thay đổi mảng gốc khi sort
                .sort((a, b) => a.number - b.number)
                .map((step, index) => (
                  <li key={step.number} className="flex items-center justify-between">
                    <span
                      onClick={() => {
                        const editedStep = prompt("Chỉnh sửa bước thực hiện", step.step);
                        if (editedStep && editedStep.trim()) {
                          const updatedSteps = [...steps];
                          const realIndex = updatedSteps.findIndex((s) => s.number === step.number);
                          if (realIndex !== -1) {
                            updatedSteps[realIndex] = {
                              ...step,
                              step: editedStep.trim(),
                            };
                            setSteps(updatedSteps);
                          }
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {step.number}. {step.step}
                    </span>
                    <button
                      onClick={() =>
                        setSteps(steps.filter((s) => s.number !== step.number))
                      }
                      className="text-red-500 px-2"
                    >
                      X
                    </button>
                  </li>
                ))}
            </ul>

            <div className="flex gap-2">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newStep.trim()) {
                    setSteps([...steps, { number: steps.length + 1, step: newStep.trim() }]);
                    setNewStep("");
                  }
                }}
                placeholder="Nhập bước thực hiện nhấn Enter để thêm bước mới"
                className="border rounded-lg p-2 w-full mt-2"
              />
              {formErrors.ingredients && <p className="text-red-500">{formErrors.ingredients}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={handleSubmit} className="text-white bg-blue-600 px-4 py-2 rounded-lg">
            {isEditing ? 'Cập nhật' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
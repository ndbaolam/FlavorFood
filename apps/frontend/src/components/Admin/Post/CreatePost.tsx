import { toast } from "react-toastify";
import { Recipe, Ingredient, Category, Step, Nutrition } from "../../../pages/Meals/recipe.interface";
import React, { useState } from "react";

interface CreatePostProps {
  initialData?: Recipe;
  onClose: () => void;
  onSubmit: (data: Recipe) => void;
  isEditing?: boolean; 
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onSubmit, initialData, isEditing }) => {
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [time, setTime] = useState<number>(initialData?.time || 0);
  const [serving, setServing] = useState<number>(initialData?.serving || 0);
  const [image, setImage] = useState<string>(initialData?.image || "");
  const [difficulty, setDifficulty] = useState<Recipe["difficulty_level"]>(initialData?.difficulty_level || "Dễ");
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialData?.ingredients || []);
  const [steps, setSteps] = useState<Step[]>(initialData?.steps || []);
  const [categories, setCategories] = useState<Category[]>(initialData?.categories || []);
  const [nutrition, setNutrition] = useState<Nutrition[]>(initialData?.nutrition || []);
  const [timeError, setTimeError] = useState('');
  const [servingError, setServingError] = useState('');
  const [newStep, setNewStep] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");

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

  const defaultCategories: Category[] = [
    { category_id: 1, title: "Món chính" },
    { category_id: 2, title: "Tráng miệng" },
    { category_id: 3, title: "Ăn vặt" },
    { category_id: 4, title: "Khai vị" },
  ];

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newRecipe: Recipe = {
        recipe_id: initialData?.recipe_id || Date.now(),
        title,
        description,
        time,
        serving,
        image,
        difficulty_level: difficulty,
        ingredients,
        steps,
        categories,
        nutrition,
        rating: initialData?.rating || { averageRating: 0, reviews: 0 },
        isFavorite: initialData?.isFavorite || false,
        created_at: initialData?.created_at || new Date(),
        updated_at: new Date(),
      };
      onSubmit(newRecipe);
      if (isEditing) {
        toast.success("Đã sửa công thức thành công!");
      } else {
        toast.success("Đã tạo công thức thành công!");
      }
      onClose();
      
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50  ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 max-w-4xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4 text-center">Tạo công thức</h2>
        <div className="grid grid-cols-1 gap-4">
         
            <div>
              <label className="block font-medium">Tên món ăn</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-lg p-2 w-full min-h-[40px]" />
              {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
            </div>
            <div>
  <label className="block font-medium">Hình ảnh</label>
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
      Tải lên
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
      onChange={handleImageUpload}
      className="border rounded-lg p-2 w-full min-h-[40px] mt-2"
    />
  )}
  {formErrors.image && <p className="text-red-500">{formErrors.image}</p>}
  {image && <img src={image} alt="Preview" className="mt-2 max-w-full max-h-40" />}
</div>
         
          <div>
            <label className="block font-medium">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded-lg p-2 w-full h-20" />
            {formErrors.description && <p className="text-red-500">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Thời gian (phút)</label>
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
              <label className="block font-medium">Khẩu phần</label>
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
              <label className="block font-medium">Độ khó</label>
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
            <div>
              <label className="block font-medium">Danh mục</label>
              <select
                value={categories.length > 0 ? categories[0].category_id : ""}
                onChange={(e) =>
                  setCategories(defaultCategories.filter((cat) => cat.category_id === Number(e.target.value)))
                }
                className="border rounded-lg p-2 w-full min-h-[40px]"
              >
                {defaultCategories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Nguyên liệu</label>
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
                      alert("Vui lòng nhập đúng định dạng: Tên - Số lượng - Đơn vị");
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
                          alert("Vui lòng nhập đúng định dạng: Tên - Lượng - Đơn vị");
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
          <label className="block font-medium">Các bước thực hiện</label>
          <ul>
            {steps.map((step, index) => (
              <li key={index} className="flex items-center justify-between">
                <span
                  onClick={() => {
                    const editedStep = prompt(
                      "Chỉnh sửa bước thực hiện",
                      step.step
                    );
                    if (editedStep && editedStep.trim()) {
                      const updatedSteps = [...steps];
                      updatedSteps[index] = {
                        ...step,
                        step: editedStep.trim(),
                      };
                      setSteps(updatedSteps);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {step.number}. {step.step}
                </span>
                <button
                  onClick={() => setSteps(steps.filter((_, i) => i !== index))}
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
          </div>
        </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="text-white bg-gray-500 px-4 py-2 rounded-lg">Hủy</button>
          <button onClick={handleSubmit} className="text-white bg-blue-600 px-4 py-2 rounded-lg">
            {isEditing ? 'Cập nhật' : 'Tạo'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CreatePost;  
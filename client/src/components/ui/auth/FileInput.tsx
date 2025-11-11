import { useState, useRef } from "react";
import {
  PhotoIcon as PhotographIcon,
  XMarkIcon as XIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface FileInputProps {
  name: string;
  error?: string;
  accept?: string;
}

export default function FileInput({
  name,
  error,
  accept = "image/png, image/jpeg",
}: FileInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
          file
            ? "border-teal-400 bg-teal-400/10"
            : "border-gray-600 hover:border-teal-400 hover:bg-gray-700/30"
        }`}>
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-gray-800/80 rounded-full text-red-400 hover:bg-gray-700 transition-colors">
              <XIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-2 left-2 flex items-center bg-gray-800/80 px-2 py-1 rounded-md text-xs text-teal-400">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              {file?.name.substring(0, 20)}
              {file?.name?.length > 20 ? "..." : ""}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
            <PhotographIcon className="h-10 w-10 mb-2 text-gray-400 group-hover:text-teal-400 transition-colors" />
            <p className="text-sm text-gray-400 text-center">
              <span className="font-medium text-teal-400">Click to upload</span>{" "}
              your avatar
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG (max 5MB)</p>
          </div>
        )}
        <input
          id={name}
          name={name}
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </label>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

//@tsnocheck
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

const DragDropCard = ({
  file,
  key,
  handleRemoveFile,
  index,
}: {
  file: File;
  key: string;
  handleRemoveFile: (i: number) => void;
  index: number;
}) => {
  const [percentage, setPercentage] = useState(Math.floor(Math.random() * 56));
  useEffect(() => {
    setTimeout(() => {
      setPercentage(Math.floor(Math.random() * (83 - 56) + 56));
    }, 280);
    setTimeout(() => {
      setPercentage(100);
    }, 568);
  }, []);
  return (
    <div className="w-full relative flex items-center flex-col" key={key}>
      <ImCancelCircle
        className="absolute top-1.5 right-1.5 cursor-pointer hover:text-red-600"
        onClick={() => handleRemoveFile(index)}
      />
      <div className="flex items-center justify-start gap-2.5 w-full">
        <Image
          src={URL.createObjectURL(file)}
          width={60}
          height={60}
          quality={10}
          alt="image"
          className="size-14 object-contain border border-stone-200 shadow-inne p-1"
        />
        <div>
          <p className="text-black text-base">{file.name}</p>
          <span className="text-gray-400 font-roboto text-sm">
            {Math.floor(file.size / 1024)} KB
          </span>
        </div>
      </div>
      <div className="flex w-full gap-3.5 items-center justify-center">
        <div className="relative bg-gray-300 w-full rounded-full overflow-hidden h-2">
          <div
            className={`absolute w-[0%] h-full bg-primary transition-all`}
            style={{ width: percentage + "%" }}
          ></div>
        </div>
        <p className="font-roboto tracking-wide font-medium tetx-base text-black">
          {percentage}%
        </p>
      </div>
    </div>
  );
};

const Dragdrop = ({
  onFilesSelected,
  className,
  maxFileSize = 5242880,
  maxFileAllowed = 4,
  allowedFileTypes,
  onError,
}: {
  className?: string;
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number;
  maxFileAllowed?: number;
  allowedFileTypes: string;
  onError?: (error: string) => void;
}) => {
  const [isDraging, setIsDraging] = useState<boolean>(false);

  const [files, setFiles] = useState<File[]>([]);

  const FilesCheck = (newFiles: File[]) => {
    if (files.length >= maxFileAllowed) {
      if (onError !== undefined) {
        onError("You Can't Upload More Than " + maxFileAllowed + " Files");
      }
      return [];
    }
    const returnFiles: File[] = [];

    newFiles.map((newFile) => {
      if (newFile.size > maxFileSize) {
        if (onError !== undefined) {
          onError(
            "Maximum File Size Allowed Is " + maxFileAllowed / 1024 + " KB"
          );
        }
        return [];
      }
      if (files.length + returnFiles.length >= maxFileAllowed) {
        if (onError !== undefined) {
          onError("You Can't Upload More Than " + maxFileAllowed + " Files");
        }
        return [];
      }
      returnFiles.push(newFile);
    });
    return returnFiles;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = FilesCheck(Array.from(selectedFiles));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = FilesCheck(Array.from(droppedFiles));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    onFilesSelected(files);
    setIsDraging(false);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    onFilesSelected(files);
  };
  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);
  return (
    <section
      className={cn(
        "w-96 h-auto flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <div
        onDrop={handleDrop}
        onDragEnter={() => setIsDraging(true)}
        onDragLeave={() => setIsDraging(false)}
        onDragOver={(e) => e.preventDefault()}
        className={`flex items-center justify-center py-8  flex-col size-full rounded-md border-4 border-gray-600 border-dashed active:bg-gray-50 active:border-primary group gap-1.5 cursor-pointer relative ${
          isDraging ? "bg-gray-100 border-primary" : ""
        }`}
      >
        <FaCloudUploadAlt className="text-primary size-20 group-active:text-primary-500" />
        <p className="text-lg text-center font-roboto">
          <span className="text-black font-medium underline underline-offset-2">
            Click Here
          </span>{" "}
          Or Drag and drop <span className="text-primary"> Your File</span>
        </p>
        <span className="text-stone-600 font-roboto text-base font-medium">
          Maximum File Size {maxFileSize / 1024 / 1024} MB.
        </span>
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept={allowedFileTypes}
          multiple
          id="browse"
          className="hidden invisible opacity-0"
        />
        <label
          htmlFor="browse"
          className="absolute size-full cursor-pointer opacity-0 z-50"
        ></label>
      </div>
      {files.length > 0 && (
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {files.map((file, i) => (
            <DragDropCard
              file={file}
              key={file.name}
              index={i}
              handleRemoveFile={handleRemoveFile}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Dragdrop;

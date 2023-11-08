import UploadFile from "./UploadFile";
import UploaderContext from "./Context/UploaderContext";
export default function Uploader({
  fileList,
  customFunction,
  onChange,
  onAdd,
  onRemove,
  uploadButtonProps,
  children,
}) {
  return (
    <>
      {children && (
        <UploaderContext.Provider value={{ onAdd, uploadButtonProps }}>
          {children}
        </UploaderContext.Provider>
      )}
      <div className="file_uplaod_list flex-col">
        {fileList.map((file) => (
          <UploadFile
            key={file.uid}
            file={file}
            customFunction={customFunction}
            onRemoveF={onRemove}
            onChangeF={onChange}
          />
        ))}
      </div>
    </>
  );
}

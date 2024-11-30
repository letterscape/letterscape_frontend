import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';


const Create = () => {
  const router = useRouter();

  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }

  const handleSave = async () => {
    // 模拟保存到后端的逻辑
    console.log("content: ", content);
  };

  return (
    <div className="p-4">
      <div className="flex justify-center items-center">
        <textarea className="text-center text-5xl border font-bold border-gray-300 rounded border-none outline-none resize-none w-full h-32 p-4" placeholder="Title" onChange={handleTitleChange}>{title}</textarea>
      </div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help',
        }}
      />
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

export default observer(Create);
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { space } from "postcss/lib/list";
import { spaceApi } from "@/api/space/space";
import generateUuid from "@/lib/utils";
import { successCode } from "@/lib/constants";
import { spaceStore } from "@/store";
import { SpaceContent } from "@/store/Space";
import { useAccount } from "wagmi";


const Create = () => {
  const router = useRouter();
  const account = useAccount();

  const { space } = spaceStore;
  const { create } = space;

  const [draft, setDraft] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }

  const handleSave = async () => {
    const contentId = generateUuid();
    const param = {
      contentId: contentId,
      content: draft
    }
    spaceApi.upload(param).then(async resp => {
      debugger
      if (resp && resp.code === successCode) {
        debugger
        const cid = resp.data;
        let content = {
          contentId: contentId,
          chainId: String(account.chainId),
          author: account.address,
          title: title,
          resource: cid,
          favouriteNum: 0,
          label: 0,
          isShown: false
        } as SpaceContent
        await create(content);
        router.push("/contents").then(() => {
          router.reload();
        });
      } else {
        alert(resp.msg);
      }
    })
  };

  return (
    <div className="p-4">
      <div className="flex justify-center items-center">
        <textarea className="text-center text-5xl border font-bold border-gray-300 rounded border-none outline-none resize-none w-full h-32 p-4" placeholder="Title" onChange={handleTitleChange}>{title}</textarea>
      </div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={draft}
        onEditorChange={(newContent) => setDraft(newContent)}
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
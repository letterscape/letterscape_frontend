import { observer } from "mobx-react-lite";

interface DraftEditorProps {
  initialContent?: string; // 可选：初始内容（JSON 格式的字符串）
  onSave?: (content: string) => void; // 保存事件处理
}

const Create = () => {

  return (
    <div>
      <p>Create</p>
    </div>
  );
}

export default observer(Create);
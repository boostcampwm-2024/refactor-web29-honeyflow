import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Milkdown, MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";

import { WS_URL } from "@/api/constants";
import useMilkdownCollab from "@/hooks/useMilkdownCollab";
import { getRoomNumber } from "@/api/load-balancer";
import useMilkdownEditor from "@/hooks/useMilkdownEditor";

import { BlockView } from "./Block";
import "./Editor.css";

function MilkdownEditor() {
  const { noteId } = useParams<Record<"noteId", string>>();

  const [roomNumber, setRoomNumber] = useState<string>();

  useEffect(() => {
    const requestRoomNumber = async () => {
      const response = await getRoomNumber("note", noteId);
      return response.server;
    };

    const initRoomNumber = async () => {
      const roomNumber = await requestRoomNumber();
      setRoomNumber(roomNumber);
    };

    initRoomNumber();
  }, [noteId]);
  const { loading, get } = useMilkdownEditor({
    BlockView,
  });

  useMilkdownCollab({
    editor: loading ? null : get() || null,
    websocketUrl: roomNumber ? `${WS_URL}/${roomNumber}/note` : null,
    roomName: noteId || "",
  });
  return <Milkdown />;
}

function MilkdownEditorWrapper() {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
}

export default MilkdownEditorWrapper;

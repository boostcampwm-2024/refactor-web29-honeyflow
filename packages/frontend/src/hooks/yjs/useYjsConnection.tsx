import { useEffect, useState } from "react";

import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { WS_URL } from "@/api/constants";
import { getRoomNumber } from "@/api/load-balancer";
import { generateUserColor } from "@/lib/utils";

export default function useYjsConnection(docName: string) {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<Error>();
  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [yProvider, setYProvider] = useState<Y.AbstractConnector>();

  useEffect(() => {
    setStatus("connecting");

    const reqeustRoomNumber = async () => {
      const response = await getRoomNumber("space", docName);
      return response.server;
    };

    const roomNumber = reqeustRoomNumber();

    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      `${WS_URL}/${roomNumber}/space`,
      docName,
      doc,
    );
    // ws://localhost/ws/room1/space/{id를 넣어보세요}

    setYDoc(doc);
    setYProvider(provider);

    const { awareness } = provider;

    provider.on(
      "status",
      (event: { status: "connected" | "connecting" | "disconnected" }) => {
        if (event.status === "connected") {
          awareness.setLocalStateField("color", generateUserColor());
        }
        setStatus(event.status);
      },
    );

    provider.once("connection-close", (event: CloseEvent) => {
      if (event.code === 1008) {
        provider.shouldConnect = false;
        setError(new Error("찾을 수 없거나 접근할 수 없는 스페이스예요."));
      }
    });

    return () => {
      if (provider.bcconnected || provider.wsconnected) {
        provider.disconnect();
        provider.destroy();
      }
      setYDoc(undefined);
      setYProvider(undefined);
      setError(undefined);
      setStatus("disconnected");
    };
  }, [docName]);

  return { status, error, yProvider, yDoc, setYProvider, setYDoc };
}

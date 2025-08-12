// src/Kambaz/Account/Session.tsx
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const me = await client.profile();       // 已登录 -> 200
        dispatch(setCurrentUser(me));
      } catch (err: any) {
        // 未登录 -> 401，静默处理即可
        if (err?.response?.status === 401) {
          dispatch(setCurrentUser(null as any));
        } else {
          console.error(err);
        }
      } finally {
        setPending(false);
      }
    })();
  }, [dispatch]);

  if (pending) return null; // 或者返回一个 Loading UI
  return <>{children}</>;
}

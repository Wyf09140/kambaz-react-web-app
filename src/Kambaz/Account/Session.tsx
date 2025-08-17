// src/Kambaz/Account/Session.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Session({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await client.profile(); // 已登录 -> 200
        if (!alive) return;
        dispatch(setCurrentUser(me));
      } catch (err: any) {
        // 未登录/跨域/网络失败 -> 置空用户，不阻塞渲染
        if (!alive) return;
        dispatch(setCurrentUser(null as any));
        if (err?.response?.status !== 401) {
          // 只有非 401 时输出日志，避免无痕模式刷屏
          console.warn("profile failed:", err?.message || err);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [dispatch]);

  // ✅ 关键点：永远渲染 children，不要 return null
  return <>{children}</>;
}

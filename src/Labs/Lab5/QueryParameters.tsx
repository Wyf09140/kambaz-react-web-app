const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
import { useState } from "react";

export default function QueryParameters() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(4);

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>
      <input
        id="wd-query-parameter-a"
        type="number"
        className="mb-2"
        value={a}
          onChange={(e) => setA(Number(e.target.value))}

      />
      <input
        id="wd-query-parameter-b"
        type="number"
        className="mb-2"
        value={b}
        onChange={(e) => setB(Number(e.target.value))}
      />
      <div>
        <a
          id="wd-query-parameter-add"
          href={`${REMOTE_SERVER}/lab5/calculator?operation=add&a=${a}&b=${b}`}
        >
          Add {a} + {b}
        </a>
      </div>
      <div>
        <a
          id="wd-query-parameter-subtract"
          href={`${REMOTE_SERVER}/lab5/calculator?operation=subtract&a=${a}&b=${b}`}
        >
          Subtract {a} - {b}
        </a>
      </div>
      <div>
        <a
          id="wd-query-parameter-multiply"
          href={`${REMOTE_SERVER}/lab5/calculator?operation=multiply&a=${a}&b=${b}`}
        >
          Multiply {a} * {b}
        </a>
      </div>
      <div>
        <a
          id="wd-query-parameter-divide"
          href={`${REMOTE_SERVER}/lab5/calculator?operation=divide&a=${a}&b=${b}`}
        >
          Divide {a} / {b}
        </a>
      </div>
    </div>
  );
}

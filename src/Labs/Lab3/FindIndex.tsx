// src/Labs/Lab3/FindIndex.tsx

export default function FindIndex() {
  let numberArray1 = [1, 2, 4, 5, 6];
  let stringArray1 = ['string1', 'string3'];

  const fourIndex = numberArray1.findIndex(a => a === 4);
  const string3Index = stringArray1.findIndex(a => a === 'string3'); 

  return (
    <div>
      <h3>FindIndex Function</h3>
      <p>fourIndex = {fourIndex}</p>
      <p>string3Index = {string3Index}</p>
      {/* 你也可以在这里添加更多内容，比如用于调试 */}
    </div>
  );
}
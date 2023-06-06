import dynamic from "next/dynamic";

const Claude = dynamic(() => import("../components/claude"), {
  ssr: false,
});
export default function App() {
  if (typeof window !== "undefined") {
    return (
      <div className="w-screen h-screen relative">
        <Claude />
        <div
          onClick={() => {
            localStorage.removeItem("claude_history");
            localStorage.removeItem("claude_conversationId");
            window.location.reload();
          }}
          className="absolute flex justify-center items-center top-2 left-2 rounded-md bg-orange-200 text-black cursor-pointer transition-all duration-300 hover:bg-orange-500 hover:text-white px-4 py-2 z-10"
        >
          清除对话
        </div>
      </div>
    );
  }
  return null;
}

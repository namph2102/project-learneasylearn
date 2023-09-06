import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { cn } from "react-swisskit";
interface WriteVocabPros {
  currentValueGame: {
    sound: string;
    vocab_translate: string;
    vocab: string;
  };
  typeCheck: 1 | 2 | 3;
  handleRandom: () => void;
  setTypeCheck: (value: 1 | 2 | 3) => void;
}
export const classSuccess =
  "border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500  rounded-lg focus:ring-green-500 focus:border-green-500  w-full p-2.5 dark:bg-gray-700 dark:border-green-500";
export const classError =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700  rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500  w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
const WriteVocab: React.FC<WriteVocabPros> = ({
  currentValueGame,
  handleRandom,
  typeCheck,
  setTypeCheck,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputGameRef = useRef<HTMLInputElement>(null);
  const handleCheckValue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (audioRef.current) {
      audioRef.current.src = currentValueGame.sound;
      audioRef.current.play();
    }

    if (inputGameRef && inputGameRef.current) {
      const valueInput = inputGameRef.current?.value.trim()?.toLowerCase();

      if (valueInput == currentValueGame.vocab.trim()?.toLowerCase()) {
        toast.success("Trả lời đúng rồi!");
        inputGameRef.current.value = "";
        inputGameRef.current.focus();
        handleRandom();
      } else {
        setTypeCheck(3);

        toast.error("Trả lời sai rồi!");
      }
    }
  };
  return (
    <section className="flex justify-center my-4">
      <form onSubmit={handleCheckValue}>
        <h2 className="text-center font-bold text-2xl mb-4">Điền từ vựng</h2>
        <div className="mb-1">
          <label htmlFor="success" className="block mb-2 text-sm font-medium ">
            Từ vựng : {currentValueGame.vocab_translate}
          </label>
          <input
            type="text"
            className={cn(
              "border block px-2 py-1 text-xl ",
              typeCheck == 2 ? classSuccess : "",
              typeCheck == 3 ? classError : ""
            )}
            placeholder="Nhập từ tiếng anh"
            ref={inputGameRef}
          />
        </div>
        {typeCheck == 3 && (
          <p className="text-sm mb-2 text-red-600 dark:text-red-500">
            <span className="font-medium">{currentValueGame.vocab}</span> Mới là
            chính xác nhé!
          </p>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handleRandom}
            className="py-2 px-5 bg-yellow-400 hover:bg-yellow-600 rounded-xl"
          >
            Random
          </button>
          <button
            type="submit"
            className="py-2 px-5 bg-green-400 hover:bg-green-600 rounded-xl"
          >
            Check
          </button>
        </div>
      </form>
      <audio ref={audioRef} className="hidden" />
    </section>
  );
};

export default WriteVocab;

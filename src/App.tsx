import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Pagination, TabsProps, Tabs } from "antd";
import { translateHaveSoundWithCurrent, langs } from "translate-audio";

import { Toaster, toast } from "react-hot-toast";
import SpinFC from "antd/es/spin";
import { SoundOutlined } from "@ant-design/icons";
import WriteVocab from "./component/WriteVocab";
import ListenVocab from "./component/ListenVocab";
interface IData {
  vocab: string;
  vocab_translate: string;

  sound: string;
}
const pageInView = 5;

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fromLanguge, setFromLanguge] = useState<any>("en");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [toLanguage, setToLanguage] = useState<any>("vi");
  const [isLoadding, setIsLoadding] = useState(false);
  const [vocab, setVocab] = useState("");
  const [page, setPage] = useState(1);
  const [listData, setListData] = useState<IData[]>(() => {
    const listVocabs = localStorage.getItem("listVocabs");
    if (listVocabs) {
      return JSON.parse(listVocabs).reverse();
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("listVocabs", JSON.stringify(listData));
  }, [listData.length]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vocab) return;
    setIsLoadding(true);
    translateHaveSoundWithCurrent(vocab.trim().toLowerCase(), {
      from: fromLanguge,
      to: toLanguage,
    }).then((data: IData) => {
      setListData((prev) => {
        const checkItemExtensive = prev.some(
          (item) => item.vocab.toLowerCase() == data.vocab.toLowerCase()
        );
        if (!checkItemExtensive) {
          toast.success(
            `Thêm thành công từ: ${vocab} = ` + data.vocab_translate
          );
          return [
            {
              sound: data.sound,
              vocab: data.vocab,
              vocab_translate: data.vocab_translate,
            },
            ...prev,
          ];
        }
        toast.success(`từ đã tồn tại rồi`);
        return prev;
      });
      playSound(data.sound);

      setVocab("");
      setIsLoadding(false);
    });
  };
  const handleReset = () => {
    localStorage.removeItem("listVocabs");
    setListData(() => []);
  };

  const [typeCheck, setTypeCheck] = useState<1 | 2 | 3>(1);
  const [currentValueGame, setCurrentValueGame] = useState<IData>({
    sound: "",
    vocab: "",
    vocab_translate: "",
  });
  const handleRandom = () => {
    setTypeCheck(1);

    const index = Math.floor(Math.random() * listData.length);
    if (listData.length && listData[index]) {
      setCurrentValueGame(() => listData[index]);
    }
  };
  const handleRandomSound = () => {
    setTypeCheck(1);

    const index = Math.floor(Math.random() * listData.length);
    if (listData.length && listData[index]) {
      setCurrentValueGame(() => listData[index]);
      playSound(listData[index].sound);
    }
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  const playSound = (sound: string) => {
    if (audioRef.current && sound) {
      audioRef.current.src = sound;
      audioRef.current.play();
    }
  };
  const listags: TabsProps["items"] = [
    {
      key: "1",
      label: "Nhớ từ",
      children: (
        <WriteVocab
          currentValueGame={currentValueGame}
          handleRandom={handleRandom}
          typeCheck={typeCheck}
          setTypeCheck={setTypeCheck}
        />
      ),
    },
    {
      key: "2",
      label: "Nghe từ",
      children: (
        <ListenVocab
          currentValueGame={currentValueGame}
          setTypeCheck={setTypeCheck}
          handleRandomSound={handleRandomSound}
          typeCheck={typeCheck}
        />
      ),
    },
  ];

  const onChangeTag = (key: string) => {
    console.log(key);
  };
  return (
    <>
      {isLoadding && (
        <div className="fixed inset-0 flex  cursor-progress  bg-black/60 z-10">
          <SpinFC size="large" className="m-auto" />
        </div>
      )}
      <div className="container mx-auto">
        <h1 className="text-3xl mt-8 mb-4 font-bold text-center ">
          Thêm từ vựng vào kho từ điển
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="vocab"
              value={vocab}
              onChange={(e) => setVocab(e.target.value)}
              placeholder="Nhập từ vựng"
              autoFocus
              required
            />
          </div>
          {vocab && (
            <p className="text-sm mt-2">
              <span className="text-red-400">Đang gõ:</span>{" "}
              <strong className="text-base mx-2"> {vocab}</strong>
            </p>
          )}
          <div className="my-2 flex gap-2">
            <select
              onChange={(e) => setFromLanguge(e.target.value)}
              name=""
              id=""
            >
              <option value={"en"}>Ngôn ngữ hiện tại</option>
              {Object.keys(langs).map((lg) => (
                <option key={lg}>{lg}</option>
              ))}
            </select>
            <select
              onChange={(e) => setToLanguage(e.target.value)}
              name=""
              id=""
            >
              <option value={"vi"}>Dịch sang nước</option>
              {Object.keys(langs).map((lg) => (
                <option key={lg}>{lg}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500  py-2 px-5"
            >
              Dịch
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-400 hover:bg-red-500  py-2 px-5"
            >
              Xóa chủ đề
            </button>
          </div>
        </form>

        <section className=" my-4">
          <div className="relative overflow-x-auto min-h-[500px]">
            <table className="w-full  text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Vocab
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Translate
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Audio
                  </th>
                </tr>
              </thead>
              <tbody>
                {listData
                  .slice((page - 1) * pageInView, page * pageInView)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                      >
                        {item.vocab}
                      </th>

                      <td className="px-6 py-4 capitalize">
                        {item.vocab_translate}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => playSound(item.sound)}
                          className="py-2 text-white bg-pink-400 hover:bg-pink-500 rounded-full px-3"
                        >
                          <SoundOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="text-center">
            <Pagination
              defaultCurrent={page}
              onChange={(pageNumber) => setPage(pageNumber)}
              pageSize={pageInView}
              total={listData.length}
            />
          </div>
        </section>
        <Tabs defaultActiveKey="1" items={listags} onChange={onChangeTag} />

        <audio ref={audioRef} className="hidden" />
      </div>
      <Toaster />
    </>
  );
}

export default App;

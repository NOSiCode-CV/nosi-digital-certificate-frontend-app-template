import React, { useRef, useState } from 'react'
import { TextInput, Spinner } from "flowbite-react";

interface IProps {
    text: string;
    owner: "me" | "chat"
}

function ChatBox() {

    const formRef = useRef<HTMLFormElement | null>(null);

    const [loading, setLoading] = useState(false)

    const [chatList, setChatList] = useState<IProps[]>([]);

    const callApi = async (text: string): Promise<any> => {
        try {
            setLoading(true);
            const answer = await fetch("/api/chat?query=" + encodeURIComponent(text)).then(res => res.json());
            return answer.answer;
        } catch {
            throw new Error("fatal error")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (evt: any) => {
        evt.preventDefault();

        const formTextInput = (formRef?.current?.elements.namedItem("search") as HTMLInputElement);

        const value = formTextInput.value ?? "";

        // TODO: 
        // AVOID EMPTY VALUES
        setChatList(current => [
            ...current,
            {
                owner: "me",
                text: value
            },
            {
                owner: "chat",
                text: "Aguarde ..."
            }
        ])

        formRef?.current?.reset()

        formTextInput.setAttribute("disabled", "true")

        callApi(value).then((resp) => {
            setChatList(current => [...current.slice(0, current.length - 1), {
                "owner": "chat",
                text: resp
            }])

            formTextInput.removeAttribute("disabled")
            formTextInput.focus();
        })

        return false;
    }

    return (
        <div className="shadow-lg dark:bg-slate-500 bg-white flex flex-col fixed bottom-0 right-0 w-[400px] ">
            <div className="dark:bg-slate-800 bg-slate-200 flex-1 w-full p-2 rounded-b-lg flex flex-col justify-end overflow-y-auto">
                {
                    chatList.map((item, index) => (
                        <div key={index} className={`w-full flex flex-col pt-4 ${item.owner == "chat" ? "justify-start py-4" : "justify-end "}`}>
                            <div className={`dark:bg-slate-600 text-sm bg-slate-300 dark:text-slate-300 text-slate-800 rounded-lg p-2 shadow-md font-mono ${item.owner == "chat" ? "mr-16" : "ml-16"}`}>
                                {
                                    item.text
                                }
                            </div>
                        </div>
                    ))
                }

            </div>
            <form onSubmit={handleSubmit} ref={formRef} className='relative'>
                {
                    loading && (
                        <div className='absolute mt-2 right-4 z-20'>
                            <Spinner />
                        </div>
                    )
                }
                <TextInput name='search' placeholder="Ask for something" />
            </form>
        </div>
    )
}

export default ChatBox
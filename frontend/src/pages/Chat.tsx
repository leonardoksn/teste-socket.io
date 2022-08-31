import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid";
import io from 'socket.io-client'

const socket = io('http://localhost:8080', { transports: ['websocket'] })
socket.on('connect', () => {
    console.log('[IO] Connect => New connection has been established')
})

interface IMessage {
    id: number | string;
    message: string;
}

const myId = uuidv4()
const Chat = () => {


    const [message, updateMessage] = useState<string>('')
    const [messages, updateMessages] = useState<IMessage[]>([])


    useEffect(() => {
        const fetch = () => {
            const handleNewMessage = (newMessage: IMessage) => updateMessages([...messages, newMessage])
            socket.on('chat.message', handleNewMessage)
            return () => socket.off('chat.message', handleNewMessage)
        }
        fetch()
    }, [messages])


    const handleFormSubmit = (e: any) => {
        e.preventDefault()

        if (message.trim()) {
            socket.emit('chat.message', {
                id: myId,
                message
            })
            updateMessage('')
        }
    }
    const handleInputchange = (e: any) => {
        return updateMessage(e.target.value)
    }


    return (
        <main className="container">
            <ul className="list">
                {messages.map((m: IMessage) => (
                    <li className={`list__item list__item--${m.id === myId ? 'mine' : 'other'}`} key={m.id}>
                        <span
                            className={`message message--${m.id === myId ? 'mine' : 'other'}`}
                        >
                            {m.message}
                        </span>
                    </li>
                ))
                }
            </ul>
            <form className="form" onSubmit={handleFormSubmit}>
                <input
                    className="form__field"
                    onChange={handleInputchange}
                    placeholder="Type a new message here"
                    type="text"
                    value={message}

                />
            </form>
        </main>
    )
}

export { Chat }
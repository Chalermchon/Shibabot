import axios from 'axios'
import crypto from 'crypto'

const { CHANNEL_ACCESS_TOKEN, CHANNEL_SECRET, LIFF_ID, RICHMENU_ID } = process.env
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message"
const LINE_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
}

export const verifyXLineSignature = (req) => {
    const signature = crypto.createHmac('SHA256', CHANNEL_SECRET).update(JSON.stringify(req.body)).digest('base64').toString()
    return signature === req.headers['x-line-signature']
}

export const replyText = (replyToken, texts) => {
    const messages = Array.isArray(texts) ? texts.map(text => ({ type: 'text', text })) : [{ type: 'text', text: texts }]
    return axios.post(`${LINE_MESSAGING_API}/reply`, { replyToken, messages }, { headers: LINE_HEADERS })
}
export const pushText = (to, texts) => {
    const messages = Array.isArray(texts) ? texts.map(text => ({ type: 'text', text })) : [{ type: 'text', text: texts }]
    return axios.post(`${LINE_MESSAGING_API}/push`, { to, messages }, { headers: LINE_HEADERS })
}
export const setRichmenuFor = (userId) => {
    return axios.post(`https://api.line.me/v2/bot/user/${userId}/richmenu/richmenu-${RICHMENU_ID}`, {}, { headers: LINE_HEADERS })
}
export const unsetRichmenuFor = (userId) => {
    return axios.delete(`https://api.line.me/v2/bot/user/${userId}/richmenu`, { headers: LINE_HEADERS })
}
export const replyFlexWhenJoinGroup = async (groupId, replyToken) => {
    return axios.post(`${LINE_MESSAGING_API}/reply`, {
        replyToken: replyToken,
        messages: [{
            type: "flex",
            altText: "ลงทะเบียน",
            contents: {
                type: "bubble",
                direction: "ltr",
                header: {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            text: "Shibabot Shopping",
                            weight: "bold",
                            size: "xl",
                            color: "#676767FF",
                            align: "center",
                            gravity: "center"
                        }
                    ]
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "🙏 สวัสดีครับทุกคน 🙏",
                            weight: "regular",
                            size: "lg",
                            align: "center",
                            margin: "xs",
                            offsetBottom: "10px"
                        },
                        {
                            type: "text",
                            text: "🤖 ผมเป็นบอท(โปรแกรมโต้ตอบอัตโนมัติ) ที่จะเป็นคนกลางในการซื้อขายสินค้าต่างๆภายในหมู่บ้านของคุณให้เอง \n 🛒 คุณสามารถเลือกซื้อหรือลงขายที่ผมได้เลย และสินค้าต่างๆจะเป็นสินค้าจากภายในหมู่บ้านของคุณเท่านั้น‼️ \n📍 โดยอ้างอิงจากผู้ใช้งานในกลุ่มนี้",
                            weight: "regular",
                            size: "md",
                            align: "start",
                            gravity: "top",
                            wrap: true
                        }
                    ]
                },
                footer: {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "button",
                            action: {
                                type: "uri",
                                label: "ลงทะเบียน",
                                uri: `https://line.me/R/app/${LIFF_ID}?liff.state=%2Fregister%2F${groupId}`
                            },
                            color: "#2460C8FF",
                            margin: "none",
                            style: "primary",
                            gravity: "center"
                        }
                    ]
                },
                styles: {
                    body: {
                        separator: true,
                        separatorColor: "#B2B2B2FF"
                    }
                }
            }
        }]
    }, { headers: LINE_HEADERS })
}
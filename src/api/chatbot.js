import { apiFetch } from './client'

export function sendChatbotMessage({ conversationId, message }) {
  return apiFetch('/api/chatbot/message', {
    method: 'POST',
    body: { conversationId, message },
  })
}

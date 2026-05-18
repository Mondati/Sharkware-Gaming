import { apiFetch } from './client'

export const sendBuilderMessage = ({ conversationId, message }) =>
  apiFetch('/api/builder/message', {
    method: 'POST',
    body: { conversationId, message },
  })

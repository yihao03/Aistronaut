// src/lib/conversation.ts

const CURRENT_CONVERSATION_KEY = 'current_conversation_id'
const CONVERSATIONS_KEY = 'chat_conversations'

export interface ConversationInfo {
  id: string
  createdAt: string
  lastMessageAt: string
  title?: string
  messageCount: number
}

export interface StoredMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: string
  tripData?: any
}

export interface StoredConversation {
  info: ConversationInfo
  messages: StoredMessage[]
}

export const conversationStorage = {
  // Get current active conversation ID
  getCurrentConversationId(): string | null {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY)
  },

  // Set current active conversation ID
  setCurrentConversationId(conversationId: string): void {
    localStorage.setItem(CURRENT_CONVERSATION_KEY, conversationId)
  },

  // Clear current conversation ID
  clearCurrentConversationId(): void {
    localStorage.removeItem(CURRENT_CONVERSATION_KEY)
  },

  // Get all stored conversations
  getConversations(): Record<string, StoredConversation> {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.warn('Failed to parse stored conversations:', error)
      return {}
    }
  },

  // Get a specific conversation
  getConversation(conversationId: string): StoredConversation | null {
    const conversations = this.getConversations()
    return conversations[conversationId] || null
  },

  // Save a conversation
  saveConversation(conversation: StoredConversation): void {
    const conversations = this.getConversations()
    conversations[conversation.info.id] = conversation
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  },

  // Create a new conversation
  createConversation(conversationId: string, title?: string): StoredConversation {
    const now = new Date().toISOString()
    const conversation: StoredConversation = {
      info: {
        id: conversationId,
        createdAt: now,
        lastMessageAt: now,
        title: title || 'New Trip Planning',
        messageCount: 0
      },
      messages: []
    }
    
    this.saveConversation(conversation)
    this.setCurrentConversationId(conversationId)
    return conversation
  },

  // Add a message to a conversation
  addMessage(conversationId: string, message: StoredMessage): void {
    const conversation = this.getConversation(conversationId)
    if (!conversation) {
      console.warn(`Conversation ${conversationId} not found`)
      return
    }

    conversation.messages.push(message)
    conversation.info.messageCount = conversation.messages.length
    conversation.info.lastMessageAt = message.timestamp

    // Update title based on first user message if not set
    if (!conversation.info.title || conversation.info.title === 'New Trip Planning') {
      const firstUserMessage = conversation.messages.find(m => m.isUser)
      if (firstUserMessage && firstUserMessage.content.length > 0) {
        conversation.info.title = firstUserMessage.content.substring(0, 50) + 
          (firstUserMessage.content.length > 50 ? '...' : '')
      }
    }

    this.saveConversation(conversation)
  },

  // Delete a conversation
  deleteConversation(conversationId: string): void {
    const conversations = this.getConversations()
    delete conversations[conversationId]
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))

    // Clear current conversation if it was deleted
    if (this.getCurrentConversationId() === conversationId) {
      this.clearCurrentConversationId()
    }
  },

  // Clear all conversations
  clearAllConversations(): void {
    localStorage.removeItem(CONVERSATIONS_KEY)
    localStorage.removeItem(CURRENT_CONVERSATION_KEY)
  },

  // Get conversation list (for sidebar, etc.)
  getConversationList(): ConversationInfo[] {
    const conversations = this.getConversations()
    return Object.values(conversations)
      .map(conv => conv.info)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  },

  // Generate a unique conversation ID
  generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  // Check if a conversation exists
  conversationExists(conversationId: string): boolean {
    const conversations = this.getConversations()
    return conversationId in conversations
  },

  // Get conversation count
  getConversationCount(): number {
    const conversations = this.getConversations()
    return Object.keys(conversations).length
  }
}

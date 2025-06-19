// Mock realtime module for server-side builds
// This prevents the 'self is not defined' error by providing a no-op implementation

class MockRealtimeClient {
  constructor() {
    // Mock constructor
  }

  connect() {
    return Promise.resolve()
  }

  disconnect() {
    return Promise.resolve()
  }

  channel() {
    return new MockRealtimeChannel()
  }

  removeChannel() {
    return Promise.resolve()
  }

  removeAllChannels() {
    return Promise.resolve()
  }

  ref() {
    return Math.random().toString()
  }

  setAuth() {
    return this
  }

  onOpen() {
    return this
  }

  onClose() {
    return this
  }

  onError() {
    return this
  }
}

class MockRealtimeChannel {
  constructor() {
    // Mock constructor
  }

  subscribe() {
    return Promise.resolve()
  }

  unsubscribe() {
    return Promise.resolve()
  }

  on() {
    return this
  }

  off() {
    return this
  }

  send() {
    return Promise.resolve()
  }

  track() {
    return Promise.resolve()
  }

  untrack() {
    return Promise.resolve()
  }
}

// Export the mock classes
module.exports = {
  RealtimeClient: MockRealtimeClient,
  RealtimeChannel: MockRealtimeChannel,
  default: MockRealtimeClient
} 
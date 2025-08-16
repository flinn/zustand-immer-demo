// Define the shape of User Properties
export interface UserProperties {
  key: string
  kind: 'user'
  // Add other user-specific properties here
  [key: string]: any
}

// Define the shape of Device Properties
export interface DeviceProperties {
  key: string
  kind: 'device'
  // Add other device-specific properties here
  [key: string]: any
}

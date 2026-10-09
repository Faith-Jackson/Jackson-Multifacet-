export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'client' | 'candidate';
  name: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: 'planning' | 'active' | 'completed';
  description: string;
  progress: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

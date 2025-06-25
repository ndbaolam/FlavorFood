export interface User {
    user_id: number;
    mail: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    status: "active" | "inactive";
    role: "normal" | "admin" | "seller";
    created_at: string;
    updated_at: string;
    expired_at?: string; 
  }
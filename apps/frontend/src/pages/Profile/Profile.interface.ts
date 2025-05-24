export interface User {
    user_id: number;
    mail: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    role: "normal" | "admin" | "seller";
    created_at: string;
    updated_at: string;
    
  }
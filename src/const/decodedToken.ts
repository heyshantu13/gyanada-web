export interface DecodedToken {
    userId: string;
    user: any; // or unknown
    iat: number; // Issued At timestamp
    exp: number; // Expiry timestamp
    // You can include other properties from the JWT payload as needed
    // For example, roles, permissions, etc.
  }
  
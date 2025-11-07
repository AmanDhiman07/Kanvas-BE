// Demo credentials for testing purposes
// In production, remove this file and use only database authentication

export interface DemoUser {
    username: string;
    password: string; // Plain text for demo - in production, use hashed passwords
}

export const DEMO_USERS: DemoUser[] = [
    {
        username: "user@123",
        password: "12345",
    },
];

export const findDemoUser = (username: string): DemoUser | undefined => {
    return DEMO_USERS.find(
        (user) => user.username.toLowerCase().trim() === username.toLowerCase().trim()
    );
};


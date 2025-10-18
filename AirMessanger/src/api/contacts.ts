const API_BASE_URL = "http://localhost:3000/api";

export const contactsApi = {
  addContacts: async (name_profile: string) => {
    const userId = localStorage.getItem("googleId");

    const res = await fetch(`${API_BASE_URL}/users/contacts-add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_profile, userId }),
      credentials: "include",
    });
    return res.json();
  },
  getContacts: async () => {
    const userId = localStorage.getItem("googleId");
    if (!userId) {
      throw new Error("Google ID not found in localStorage");
    }

    const res = await fetch(
      `${API_BASE_URL}/users/contacts-get?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    return res.json();
  },
};

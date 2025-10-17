const API_BASE_URL = "http://localhost:3000/api";

export const userInfo = {
  async ChangeInfoProfile(
    avatarBase64: string | null,
    name: string,
    last_name: string
  ) {
    const googleId = localStorage.getItem("googleId");
    const res = await fetch(`${API_BASE_URL}/auth/change-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: avatarBase64, name, last_name, googleId }),
      credentials: "include",
    });
    return res.json();
  },
  async GetInfoContacts(name_profile: string) {
    const res = await fetch(
      `${API_BASE_URL}/auth/get-contacts?name_profile=${encodeURIComponent(
        name_profile
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    return res.json();
  },
};

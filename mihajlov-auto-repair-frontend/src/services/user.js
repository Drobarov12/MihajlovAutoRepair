const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

export const loginUser = async (loginForm) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Account/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Email: loginForm.username,
              Password: loginForm.password,
            }),
          });

          return response;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  };

  export const registerUser = async (registerForm) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Account/register`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                Email: registerForm.username,
                Password: registerForm.password,
                PhoneNumber: registerForm.phoneNumber,
                }),
            });
        return response;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  };
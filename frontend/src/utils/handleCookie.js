export const setCookie = (name, value, daysToExpire = 7) => {
  const d = new Date();
  d.setTime(d.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const getCookie = name => {
  const cookies = document.cookie.split('; ');
  const cookieValue = cookies.find(cookie => {
    return cookie.split('=')[0] === name;
  });

  if (cookieValue) return cookieValue.split('=')[1];

  return null;
};

export const removeCookie = name => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const getUserInfoFromCookie = () => {
  const user = getCookie('user');

  if (user) {
    return JSON.parse(user);
  }
  return null;
};


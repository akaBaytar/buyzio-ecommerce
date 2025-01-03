const encoder = new TextEncoder();

const salt = crypto.getRandomValues(new Uint8Array(16)).join('');

export const hash = async (password: string): Promise<string> => {
  const passwordData = encoder.encode(password + salt);

  const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData);

  return Array
    .from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const compare = async (password: string,encrypted: string): Promise<boolean> => {
  const hashedPassword = await hash(password);

  return hashedPassword === encrypted;
};

export async function sendSMS(number: string, message: string) {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    throw new Error('SMS_API_KEY is not configured');
  }

  const url = `https://fraudchecker.link/api/v1/sms/?api_key=${apiKey}&number=${number}&message=${encodeURIComponent(message)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send SMS', error);
    throw error;
  }
}

export async function getSMSBalance() {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    throw new Error('SMS_API_KEY is not configured');
  }

  const url = `https://fraudchecker.link/api/v1/sms/balance.php?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get SMS balance', error);
    throw error;
  }
}

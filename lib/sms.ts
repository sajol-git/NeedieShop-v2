export async function sendSMS(number: string, message: string) {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    console.error('SMS_API_KEY is not configured');
    return { success: false, error: 'SMS API key missing' };
  }

  const url = `https://fraudchecker.link/api/v1/sms/?api_key=${apiKey}&number=${number}&message=${encodeURIComponent(message)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('SMS API Response:', data);

    // Based on common patterns for such APIs, success might be indicated by a status field or similar.
    // If the API returns { status: "success", ... } or { success: true, ... }
    if (data.status === 'success' || data.success === true || data.code === '200' || data.status === 'sent' || data.status === 'OK') {
      return { success: true, data };
    }

    return { success: false, data, error: data.message || 'Failed to send SMS' };
  } catch (error) {
    console.error('Failed to send SMS', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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

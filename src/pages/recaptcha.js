import 'dotenv/config';

export async function POST({ request }) {
  const data = await request.json();
  // console.log({ data });
  if (!data.recaptcha) {
    return new Response(JSON.stringify({ success: false, message: 'No recaptcha token provided' }), { status: 400 });
  }
  const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
  const requestHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const requestBody = new URLSearchParams({
    secret: process.env.SECRET_KEY,   // This can be an environment variable
    response: data.recaptcha          // The token passed in from the client
  });

  const response = await fetch(recaptchaURL, {
    method: "POST",
    headers: requestHeaders,
    body: requestBody.toString()
  });
  // console.log({ response });
  const responseData = await response.json();

  return new Response(JSON.stringify(responseData), { status: 200 });
}
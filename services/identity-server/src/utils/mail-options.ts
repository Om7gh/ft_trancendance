export function confirmMailOptions(email: string, url: string) {
  return {
    from: '"42 Transcendence" <no-reply@transcendence.com>',
    to: email,
    subject: '42 Transcendence: Email Confirmation',
    html: `
      <div style="padding: 40px 20px; font-family: 'Courier New', monospace;">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #000;">
          <h1 style="color: #000; text-align: center; padding: 40px 20px; margin: 0; border-bottom: 2px dashed #000; font-size: 32px; letter-spacing: 2px;">
            42 TRANSCENDENCE
          </h1>

          <div style="display: flex; align-items: center;">
            <div style="width: 15px; height: 120px; background: #000; margin: 0 15px; border-radius: 3px;"></div>

            <div style="flex: 1; padding: 60px 30px; text-align: center;">
              <h2 style="color: #000; margin: 0 0 20px; font-size: 24px;">GAME ON! 🎮</h2>
              <p style="color: #333; margin: 0 0 30px; font-size: 16px;">
                Welcome to the arena! Click the button below to confirm your account.
              </p>

              <a href="${url}" style="display: inline-block; padding: 18px 50px; font-size: 18px; color: #fff; background: #000; text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 8px;">
                CONFIRM ACCOUNT
              </a>

              <div style="margin: 40px 0 30px; height: 2px; background: repeating-linear-gradient(to right, #000 0px, #000 10px, transparent 10px, transparent 20px); position: relative;">
                <div style="position: absolute; top: -5px; left: 50%; width: 12px; height: 12px; background: #000; border-radius: 50%; transform: translateX(-50%);"></div>
              </div>

              <p style="color: #666; margin: 0; font-size: 14px;">Link: ${url}</p>
            </div>

            <div style="width: 15px; height: 120px; background: #000; margin: 0 15px; border-radius: 3px;"></div>
          </div>

          <p style="color: #666; text-align: center; padding: 30px 20px; margin: 0; border-top: 2px dashed #000; font-size: 12px;">
            This link expires in 24 hours. © 2024 42 Transcendence 🚀
          </p>
        </div>
      </div>
    `,
  };
}

export function resetPasswordOptions(email: string, url: string) {
  return {
    from: '"42 Transcendence" <no-reply@transcendence.com>',
    to: email,
    subject: '42 Transcendence: Reset Your Password',
    html: `
      <div style="padding: 40px 20px; font-family: 'Courier New', monospace;">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #000;">
          <h1 style="color: #000; text-align: center; padding: 40px 20px; margin: 0; border-bottom: 2px dashed #000; font-size: 32px; letter-spacing: 2px;">
            42 TRANSCENDENCE
          </h1>

          <div style="display: flex; align-items: center;">
            <div style="width: 15px; height: 120px; background: #000; margin: 0 15px; border-radius: 3px;"></div>

            <div style="flex: 1; padding: 60px 30px; text-align: center;">
              <h2 style="color: #000; margin: 0 0 20px; font-size: 24px;">PASSWORD RESET 🔐</h2>
              <p style="color: #333; margin: 0 0 30px; font-size: 16px;">
                We received a request to reset your password. Click the button below to set a new password.
              </p>

              <a href="${url}" style="display: inline-block; padding: 18px 50px; font-size: 18px; color: #fff; background: #000; text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 8px;">
                RESET PASSWORD
              </a>

              <div style="margin: 40px 0 30px; height: 2px; background: repeating-linear-gradient(to right, #000 0px, #000 10px, transparent 10px, transparent 20px); position: relative;">
                <div style="position: absolute; top: -5px; left: 50%; width: 12px; height: 12px; background: #000; border-radius: 50%; transform: translateX(-50%);"></div>
              </div>

              <p style="color: #666; margin: 0; font-size: 14px;">Link: ${url}</p>
              <p style="color: #f44; margin: 15px 0 0; font-size: 13px;">
                ⚠️ If you didn't request this, please ignore this email.
              </p>
            </div>

            <div style="width: 15px; height: 120px; background: #000; margin: 0 15px; border-radius: 3px;"></div>
          </div>

          <p style="color: #666; text-align: center; padding: 30px 20px; margin: 0; border-top: 2px dashed #000; font-size: 12px;">
            This link expires in 1 hour. © 2024 42 Transcendence 🚀
          </p>
        </div>
      </div>
    `,
  };
}

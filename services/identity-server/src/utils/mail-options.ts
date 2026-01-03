export function confirmMailOptions(email: string, url: string) {
    return {
        from: '"Agents 923 [Pong | Chess] Games" <no-reply@agents923.com>',
        to: email,
        subject: 'Agents 923 [Pong | Chess] Games: Email Confirmation',
        html: `
      <div style="padding: 40px 20px; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #8b5cf6; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);">
          <div style="background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); padding: 40px 20px;">
            <h1 style="color: #fff; text-align: center; margin: 0; font-size: 32px; letter-spacing: 3px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
              Agents 923 [Pong | Chess] Games
            </h1>
          </div>

          <div style="background: #1e293b; padding: 60px 30px; text-align: center;">
            <h2 style="color: #fff; margin: 0 0 20px; font-size: 28px; background: linear-gradient(90deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              GAME ON! 🎮
            </h2>
            <p style="color: #cbd5e1; margin: 0 0 35px; font-size: 16px; line-height: 1.6;">
              Welcome to the arena! Click the button below to confirm your account and start your journey.
            </p>

            <a href="${url}" style="display: inline-block; padding: 18px 50px; font-size: 18px; color: #fff; background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 8px; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4); transition: transform 0.2s;">
              CONFIRM ACCOUNT
            </a>

           <div style="margin: 45px 0 35px; position: relative;">
              <div style="height: 2px; background: linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, transparent);"></div>
              <div style="position: absolute; top: -6px; left: 50%; width: 14px; height: 14px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 50%; transform: translateX(-50%); box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);"></div>
            </div>

            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 15px; margin-top: 30px;">
              <p style="color: #94a3b8; margin: 0; font-size: 13px; word-break: break-all;">${url}</p>
            </div>
          </div>

          <div style="background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%); border-top: 2px solid #334155; padding: 25px 20px;">
            <p style="color: #64748b; text-align: center; margin: 0; font-size: 12px;">
              This link expires in 24 hours. © 2024 Agents 923 [Pong | Chess] Games 🚀
            </p>
          </div>
        </div>
      </div>
    `,
    };
}

export function resetPasswordOptions(email: string, url: string) {
    return {
        from: '"Agents 923 [Pong | Chess] Games" <no-reply@agents923.com>',
        to: email,
        subject: 'Agents 923 [Pong | Chess] Games: Reset Your Password',
        html: `
      <div style="padding: 40px 20px; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #8b5cf6; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);">
          <div style="background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); padding: 40px 20px;">
            <h1 style="color: #fff; text-align: center; margin: 0; font-size: 32px; letter-spacing: 3px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
              Agents 923 [Pong | Chess] Games
            </h1>
          </div>

          <div style="background: #1e293b; padding: 60px 30px; text-align: center;">
            <h2 style="color: #fff; margin: 0 0 20px; font-size: 28px; background: linear-gradient(90deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              PASSWORD RESET 🔐
            </h2>
            <p style="color: #cbd5e1; margin: 0 0 35px; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Click the button below to set a new password.
            </p>

            <a href="${url}" style="display: inline-block; padding: 18px 50px; font-size: 18px; color: #fff; background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 8px; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);">
              RESET PASSWORD
            </a>

           <div style="margin: 45px 0 35px; position: relative;">
              <div style="height: 2px; background: linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, transparent);"></div>
              <div style="position: absolute; top: -6px; left: 50%; width: 14px; height: 14px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 50%; transform: translateX(-50%); box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);"></div>
            </div>

            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 15px; margin-top: 30px;">
              <p style="color: #94a3b8; margin: 0; font-size: 13px; word-break: break-all;">${url}</p>
            </div>

            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 6px; padding: 15px; margin-top: 25px;">
              <p style="color: #fca5a5; margin: 0; font-size: 14px;">
                ⚠️ If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>

          <div style="background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%); border-top: 2px solid #334155; padding: 25px 20px;">
            <p style="color: #64748b; text-align: center; margin: 0; font-size: 12px;">
              This link expires in 1 hour. © 2024 Agents 923 [Pong | Chess] Games 🚀
            </p>
          </div>
        </div>
      </div>
    `,
    };
}

export function magicLinkOptions(email: string, url: string) {
    return {
        from: '"Agents 923 [Pong | Chess] Games" <no-reply@agents923.com>',
        to: email,
        subject: 'Agents 923 [Pong | Chess] Games: Your Magic Link',
        html: `
      <div style="padding: 40px 20px; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #8b5cf6; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);">
          <div style="background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); padding: 40px 20px;">
            <h1 style="color: #fff; text-align: center; margin: 0; font-size: 32px; letter-spacing: 3px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
              Agents 923 [Pong | Chess] Games
            </h1>
          </div>

          <div style="background: #1e293b; padding: 60px 30px; text-align: center;">
            <h2 style="color: #fff; margin: 0 0 20px; font-size: 28px; background: linear-gradient(90deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              ONE-TIME LOGIN ✨
            </h2>
            <p style="color: #cbd5e1; margin: 0 0 35px; font-size: 16px; line-height: 1.6;">
              Click the magic button below to instantly sign in. No password needed!
            </p>

            <a href="${url}" style="display: inline-block; padding: 18px 50px; font-size: 18px; color: #fff; background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 8px; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);">
              SIGN IN NOW
            </a>

            <div style="margin: 45px 0 35px; position: relative;">
              <div style="height: 2px; background: linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, transparent);"></div>
              <div style="position: absolute; top: -6px; left: 50%; width: 14px; height: 14px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 50%; transform: translateX(-50%); box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);"></div>
            </div>

            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 15px; margin-top: 30px;">
              <p style="color: #94a3b8; margin: 0; font-size: 13px; word-break: break-all;">${url}</p>
            </div>

            <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid #06b6d4; border-radius: 6px; padding: 15px; margin-top: 25px;">
              <p style="color: #67e8f9; margin: 0; font-size: 14px;">
                🔒 This is a one-time login link. It can only be used once.
              </p>
            </div>
          </div>

          <div style="background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%); border-top: 2px solid #334155; padding: 25px 20px;">
            <p style="color: #64748b; text-align: center; margin: 0; font-size: 12px;">
              This link expires in 15 minutes. © 2024 Agents 923 [Pong | Chess] Games 🚀
            </p>
          </div>
        </div>
      </div>
    `,
    };
}

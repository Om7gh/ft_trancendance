export default function mailOptions(email: string, url: string) {
  return {
    from: '"42 Transcendence" <no-reply@transcendence.com>',
    to: email,
    subject: '42 Transcendence: confirmation link',
    html: `<p>Congrats! You can click <strong><a href='${url}'>here</a></strong> to confirn your account 🚀</p>`,
  }
}

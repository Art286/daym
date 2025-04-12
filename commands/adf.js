module.exports = {
  name: "adf",
  description: "Provides dhinospanel shop payment instructions",
  nashPrefix: false,
  role: "user",
  execute: (api, event, args, prefix) => {
    const responseMessage = `🛒 Welcome to dhinospanel shop ⭑.ᐟ

💳 GCash mode of payment only:
📞 GCN: 09929805730 
🅰️ Initial: J.G.

🔗 Sign up: https://dhinospanel.shop/
🔍 Explore site to avoid asking common questions
💰 10 pesos minimum for adding funds

─── ⋆⋅📜 Rules & Regulations ⋅⋆ ───
❌ Strictly no refund once funds are added
⚠️ Always try low quantity to avoid delay orders
🔗 Always mag pa ayos ng link
❌ Wrong link no refund
🔄 No to same link - hintayin mag complete status
📸 When adding funds, send screenshot of your receipt together with your profile (strictly enforced against edited/fake receipts)

📌 RECOMMENDED GUIDE:
https://www.facebook.com/61559187959668/posts/122184739646306265/`;

    api.sendMessage(responseMessage, event.threadID);
  },
};